import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import counselorServices from '../services/counselorService';
import { useEffect, useMemo, useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { setCounselor } from '../features/counselor/counselor';
import AlertModal from '../components/AlertModal';
import { useNavigate } from 'react-router-dom';
import useOnlineUsers from '../hooks/useOnlineUsers';


export default function CounselorList() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { counselors } = useSelector(state => state.counselor)
  const { user } = useSelector(state => state.auth)
  // Realtime presence — jo counselor abhi online hai, usko 🟢 dikhao
  const onlineUsers = useOnlineUsers(user?.token)
  const isOnline = (userId) => onlineUsers.includes(String(userId))


  const { data, isLoading, isSuccess, isError, error } = useQuery({ queryKey: ['counselor'], queryFn: counselorServices.fetchCounselors })
  const { data: categories } = useQuery({ queryKey: ['counselor-categories'], queryFn: counselorServices.fetchCategories, retry: false });


  useEffect(() => {
    if (isSuccess) {
      dispatch(setCounselor(data))
    }
  }, [isSuccess, data, dispatch])

  // Backend returns ALL counselors (pending + accepted) — sirf accepted dikhao
  const visibleCounselors = useMemo(() => {
    const list = counselors || data || [];
    return list
      .filter((c) => c?.status === 'accepted')
      .filter((c) => categoryFilter === 'all' || String(c?.category?._id || c?.category) === String(categoryFilter))
      .filter((c) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          c?.user?.name?.toLowerCase().includes(q) ||
          c?.user?.qualification?.toLowerCase().includes(q) ||
          c?.category?.title?.toLowerCase().includes(q)
        );
      });
  }, [counselors, data, search, categoryFilter]);

  if (isError && error) {
    return (
      <AlertModal type='error' open={true} title={"Error Occured"} message={error?.response?.data?.message || error?.message} onConfirm={() => navigate("/auth/profile")} onClose={() => navigate("/")} />
    )
  }

  if (isLoading) {
    return (
      <LoadingScreen loadingMessage='Loading Counselors' />
    )
  }

  return (
    <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
      <Navbar activePage="counselors" />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeTab="counselors" role="student" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-grid-pattern w-full min-w-0 overflow-y-auto">
          {/* Header Banner */}
          <div className="mb-8">
            <div className="inline-block bg-yellow border-3 border-navy px-3 py-1 rounded-full shadow-pop-sm font-mono text-xs font-bold text-navy mb-2">
              VERIFIED MENTORS DIRECTORY
            </div>
            <h1 className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy">
              Book 1-on-1 Sessions with <span className="text-rust">Top Indian Experts</span>
            </h1>
            <p className="font-body text-sm text-navy-muted mt-1">
              Connect via video call or chat for resume reviews, mock interviews, and personalized career roadmaps.
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block font-grotesk font-bold text-xs uppercase text-navy mb-1">
                  Search Counselor Name or Expertise
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. System Design, UPSC, AI, IIM..."
                  className="w-full bg-parchment border-3 border-navy rounded-xl px-4 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-grotesk font-bold text-xs uppercase text-navy mb-1">
                  Domain Specialty
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-parchment border-3 border-navy rounded-xl px-3 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
                >
                  <option value="all">All Specializations</option>
                  {(categories || []).map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {visibleCounselors.length === 0 ? (
            <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 lg:p-8 shadow-pop text-center font-body text-sm text-navy">
              Koi verified counselor nahi mila. Search ya category filter badlo.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleCounselors.map((counselor) => (
                <Card key={counselor._id} color="white" classNameName="flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="w-14 h-14 rounded-2xl bg-yellow border-3 border-navy flex items-center justify-center font-grotesk font-extrabold text-xl text-navy shadow-pop-sm overflow-hidden">
                          {counselor?.user?.profilePic ? (
                            <img className="w-14 h-14 rounded-2xl object-cover" src={counselor.user.profilePic} alt={counselor?.user?.name || 'Counselor'} />
                          ) : (
                            counselor?.user?.name?.[0] || 'C'
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-grotesk font-extrabold text-lg text-navy">{counselor?.user?.name || 'Counselor'}</h3>
                            <span
                              title={isOnline(counselor?.user?._id) ? 'Online now' : 'Offline'}
                              className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-navy ${isOnline(counselor?.user?._id) ? 'bg-green-200 text-green-900' : 'bg-gray-200 text-gray-600'}`}
                            >
                              {isOnline(counselor?.user?._id) ? '🟢 ONLINE' : 'OFFLINE'}
                            </span>
                            <StatusBadge text={counselor?.isAvailable ? 'AVAILABLE' : 'BUSY'} status="success" />
                          </div>
                          <p className="font-mono text-xs font-bold text-navy-muted">{counselor?.category?.title}</p>
                          <div className="flex items-center space-x-3 mt-1 text-xs font-mono">
                            <span className="text-navy-muted">Exp :{counselor?.experience} Years</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="font-grotesk font-bold text-xs text-navy mb-2">Qualification :</div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="bg-sky/20 border border-navy text-navy font-mono text-sm font-bold px-2.5 py-0.5 rounded-full">
                          {counselor?.user?.qualification || '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-navy/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="font-mono text-xs font-bold text-rust bg-rust-container px-3 py-1 rounded-full border border-navy">
                      {counselor?.user?.location || 'India'}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:space-x-2">
                      <Button variant="outline" size="sm" type="button" clickAction={() => navigate(`/auth/counselors/${counselor._id}`)}>
                        View Profile
                      </Button>
                      <Button variant="primary" size="sm" type="button" clickAction={() => navigate(`/auth/counselors/${counselor._id}`)}>
                        Book Session →
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
