import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import LoadingScreen from '../components/LoadingScreen';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import counselorServices from '../services/counselorService';
import ratingServices from '../services/ratingService';
import messageServices from '../services/messageService';
import { setCounselor } from '../features/counselor/counselor';


export default function CounselorDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { counselors } = useSelector((state) => state.counselor);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['counselor'],
    queryFn: counselorServices.fetchCounselors,
    enabled: !counselors || counselors.length === 0,
  });

  useEffect(() => {
    if (data) dispatch(setCounselor(data));
  }, [data, dispatch]);

  const list = counselors || data || [];

  // Sirf apna record — dusre counselors ki list UI me nahi dikhate
  const myRecord = useMemo(() => {
    return list.find((c) => {
      const uid = typeof c.user === 'object' && c.user !== null ? c.user._id : c.user;
      return String(uid) === String(user?._id);
    });
  }, [list, user?._id]);

  const { data: myRatings, isLoading: ratingsLoading } = useQuery({
    queryKey: ['ratings', myRecord?._id],
    queryFn: () =>
      ratingServices.fetchRatings({ token: user?.token, counselorId: myRecord._id }),
    enabled: !!user?.token && !!myRecord?._id,
    retry: false,
  });

  // Inbox: jinhone mujhe message kiya (GET /api/messages)
  const { data: inbox, isLoading: inboxLoading } = useQuery({
    queryKey: ['inbox'],
    queryFn: () => messageServices.getInbox(user?.token),
    enabled: !!user?.token && !!myRecord,
    refetchInterval: 10000,
    retry: false,
  });

  // Click karne par seedha us student ka chat page
  // const openStudentChat = () => {
  //   navigate("/auth/counselor/messages");
  // };
  // const openReviews = () => {
  //   navigate("/auth/counselor/reviews");
  // };
  const openStudentChat = (studentId) => {
    navigate(`/auth/counselor/messages?studentId${studentId}`);
  };

  const openReviews = () => {
    navigate(`/auth/counselor/reviews`);
  };

  if (isLoading && !counselors) {
    return <LoadingScreen loadingMessage="Loading Counselor Dashboard" />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-parchment flex flex-col">
        <Navbar activePage="dashboard" />
        <div className="flex-1 flex">
          <Sidebar activeTab="counselor_overview" role="counselor" />
          <main className="flex-1 p-8">
            <div className="bg-parchment-card border-4 border-navy rounded-3xl p-8 shadow-pop text-center font-body text-sm text-navy">
              Failed to load counselor record: {error?.response?.data?.message || error?.message}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!myRecord) {
    return (
      <div className="min-h-screen bg-parchment flex flex-col">
        <Navbar activePage="dashboard" />
        <div className="flex-1 flex">
          <Sidebar activeTab="counselor_overview" role="counselor" />
          <main className="flex-1 p-8 bg-grid-pattern overflow-y-auto">
            <div className="bg-parchment-card border-4 border-navy rounded-3xl p-8 shadow-pop text-center max-w-2xl mx-auto">
              <StatusBadge text="NO COUNSELOR RECORD" status="success" />
              <h1 className="font-grotesk font-extrabold text-2xl text-navy mt-3">
                Hi {user?.name}, aapka counselor record nahi mila
              </h1>
              <p className="font-body text-sm text-navy-muted mt-2">
                Pehle Become Counselor form submit karo. Admin approval ke baad yahan sirf aapki details dikhengi.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const avgRating =
    myRatings && myRatings.length > 0
      ? (myRatings.reduce((s, r) => s + Number(r.rating || 0), 0) / myRatings.length).toFixed(1)
      : null;

  const statusText =
    myRecord.status === 'accepted' ? 'VERIFIED' : myRecord.status === 'pending' ? 'PENDING REVIEW' : 'REJECTED';

  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      <Navbar activePage="dashboard" />

      <div className="flex-1 flex">
        <Sidebar activeTab="counselor_overview" role="counselor" />

        <main className="flex-1 p-8 bg-grid-pattern overflow-y-auto">
          {/* Sirf apni details — koi list, koi bahar ka link nahi */}
          <div className="bg-yellow border-4 border-navy rounded-3xl p-6 shadow-pop mb-8">
            <div className="inline-block bg-navy text-yellow font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-2">
              Counselor Portal • {user?.name} • {myRecord.category?.title}
            </div>
            <h1 className="font-grotesk font-extrabold text-3xl text-navy">
              Welcome back, {user?.name}! 🎓
            </h1>
            <p className="font-body text-sm text-navy-muted mt-1">
              Status: <span className="font-bold text-navy">{myRecord.status}</span>
              {' '}• Availability: <span className="font-bold text-navy">{myRecord.isAvailable ? 'Available' : 'Busy'}</span>
              {avgRating && <span> • ★ {avgRating} ({myRatings.length} reviews)</span>}
            </p>
          </div>

          {myRecord.status === 'pending' && (
            <div className="bg-yellow/40 border-3 border-navy rounded-2xl p-4 shadow-pop-sm mb-8 font-body text-xs text-navy">
              Aapki application <span className="font-bold">pending</span> hai. Admin approval ke baad COUNSELOR role milega.
            </div>
          )}
          {myRecord.status === 'rejected' && (
            <div className="bg-red-100 border-3 border-navy rounded-2xl p-4 shadow-pop-sm mb-8 font-body text-xs text-navy">
              Aapki application <span className="font-bold">rejected</span> hui hai. Admin se contact karo.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card color="white">
              <div className="font-mono text-xs font-bold text-navy-muted uppercase">Profile Status</div>
              <div className="font-grotesk font-extrabold text-3xl text-navy mt-2">{statusText}</div>
              <div className="text-xs text-navy font-bold mt-1">{myRecord.category?.title}</div>
            </Card>

            <Card color="white">
              <div className="font-mono text-xs font-bold text-navy-muted uppercase">Availability</div>
              <div className="font-grotesk font-extrabold text-3xl text-navy mt-2">
                {myRecord.isAvailable ? 'Online' : 'Offline'}
              </div>
              <div className="text-xs text-navy-muted font-bold mt-1">Admin dwara update hota hai</div>
            </Card>

            <Card color="white">
              <div className="font-mono text-xs font-bold text-navy-muted uppercase">My Rating</div>
              <div className="font-grotesk font-extrabold text-3xl text-navy mt-2">
                {ratingsLoading ? '...' : avgRating ? `★ ${avgRating}` : 'No reviews'}
              </div>
              <div className="text-xs text-rust font-bold mt-1">
                {myRatings ? `${myRatings.length} review(s)` : ''}
              </div>
            </Card>

            <Card color="yellow">
              <div className="font-mono text-xs font-bold text-navy uppercase">Experience</div>
              <div className="font-grotesk font-extrabold text-3xl text-navy mt-2">{myRecord.experience} yrs</div>
              <div className="text-xs text-navy font-bold mt-1">{user?.qualification}</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-parchment-card border-4 border-navy rounded-3xl p-6 shadow-pop">
                <h2 className="font-grotesk font-extrabold text-xl text-navy mb-4">My Counselor Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-body text-xs">
                  <div className="bg-parchment p-3 rounded-xl border border-navy">Name: <span className="font-bold">{user?.name}</span></div>
                  <div className="bg-parchment p-3 rounded-xl border border-navy">Category: <span className="font-bold">{myRecord.category?.title}</span></div>
                  <div className="bg-parchment p-3 rounded-xl border border-navy">Experience: <span className="font-bold">{myRecord.experience} years</span></div>
                  <div className="bg-parchment p-3 rounded-xl border border-navy">Qualification: <span className="font-bold">{user?.qualification}</span></div>
                  <div className="bg-parchment p-3 rounded-xl border border-navy">Location: <span className="font-bold">{user?.location}</span></div>
                  <div className="bg-parchment p-3 rounded-xl border border-navy">Credits: <span className="font-bold">{user?.credits ?? 0}</span></div>
                </div>
              </div>

              {/* Student message par click → chat par navigate */}
              <div className="bg-parchment-card border-4 border-navy rounded-3xl p-6 shadow-pop">
                <h2 className="font-grotesk font-extrabold text-xl text-navy mb-4">Student Messages</h2>
                {inboxLoading ? (
                  <p className="font-body text-xs text-navy-muted">Loading student chats...</p>
                ) : inbox && inbox.length > 0 ? (
                  <div className="space-y-3">
                    {inbox.map((chat) => {
                      const sid = chat.user?._id || chat.user;
                      return (
                        <div
                          key={sid}
                          onClick={() => openStudentChat(sid)}
                          className="bg-parchment border-3 border-navy p-4 rounded-2xl shadow-pop-sm cursor-pointer hover:bg-parchment-dim transition-all"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-xl bg-sky border-2 border-navy flex items-center justify-center font-grotesk font-extrabold text-sm text-navy overflow-hidden">
                                {chat.user?.profilePic ? (
                                  <img src={chat.user.profilePic} alt={chat.user.name} className="w-full h-full object-cover" />
                                ) : (
                                  chat.user?.name?.[0] || 'S'
                                )}
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-grotesk font-extrabold text-base text-navy">{chat.user?.name || 'Student'}</span>
                                  {(chat.unreadCount || 0) > 0 && (
                                    <span className="w-5 h-5 rounded-full bg-rust text-white font-mono text-[10px] font-bold flex items-center justify-center border border-navy">
                                      {chat.unreadCount}
                                    </span>
                                  )}
                                </div>
                                <p className="font-body text-xs text-navy-muted mt-1">"{chat.lastMessage}"</p>
                              </div>
                            </div>
                            <Button variant="primary" size="sm" >
                              Open Chat →
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="font-body text-xs text-navy-muted">
                    Abhi kisi student ne message nahi kiya. Message aate hi yahan dikhega.
                  </p>
                )}
              </div>

              <div className="bg-parchment-card border-4 border-navy rounded-3xl p-6 shadow-pop">
                <h2 className="font-grotesk font-extrabold text-xl text-navy mb-4">My Student Reviews</h2>
                {ratingsLoading ? (
                  <p className="font-body text-xs text-navy-muted">Loading reviews...</p>
                ) : myRatings && myRatings.length > 0 ? (
                  <div className="space-y-3">
                    {myRatings.map((rev) => {
                      const reviewerId =
                        typeof rev.user === 'object' && rev.user !== null
                          ? rev.user._id
                          : rev.user;
                      return (
                        <div
                          key={rev._id}
                          onClick={() => reviewerId && openReviews(reviewerId)}
                          className="bg-parchment border-2 border-navy p-4 rounded-2xl shadow-pop-sm cursor-pointer hover:bg-parchment-dim transition-all"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-grotesk font-bold text-sm text-navy">{rev.user?.name || 'Student'}</span>
                            <span className="font-mono text-xs font-bold text-rust">{rev.rating} ★</span>
                          </div>
                          <p className="font-body text-xs text-navy-muted">"{rev.review}"</p>
                          <p className="font-mono text-[10px] font-bold text-rust mt-1">Open Chat →</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="font-body text-xs text-navy-muted">No reviews yet.</p>
                )}
              </div>


            </div>

            <div className="space-y-6">
              <div className="bg-parchment-card border-4 border-navy rounded-3xl p-6 shadow-pop">
                <h3 className="font-grotesk font-extrabold text-lg text-navy mb-3">My Status</h3>
                <div className="space-y-3 font-body text-xs">
                  <div className="flex justify-between items-center bg-parchment p-3 rounded-xl border border-navy">
                    <span>Account Active</span>
                    <span className="font-bold text-navy font-mono">{String(myRecord.isActive)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-parchment p-3 rounded-xl border border-navy">
                    <span>Applied On</span>
                    <span className="font-bold text-navy font-mono">{myRecord.createdAt ? new Date(myRecord.createdAt).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
