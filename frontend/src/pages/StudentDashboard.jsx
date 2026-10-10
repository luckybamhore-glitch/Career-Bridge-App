import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSocket } from '../lib/socket';
import dashboardService from '../services/dashboardService';
import roadmapService from '../services/roadmapService';
import LoadingScreen from '../components/LoadingScreen';
import toast from 'react-hot-toast';
import { updateCredits } from '../features/auth/authSlice';

export default function StudentDashboard() {

  const {user} = useSelector(state => state.auth)
     const navigate =  useNavigate()
     const dispatch = useDispatch()

     // Aggregated user-dashboard backend: profile, stats, roadmaps, sessions, wallet, mentor
     const {data : dashboard , isError , error , isLoading , isSuccess} = useQuery({
       queryKey :["user-dashboard"],
       queryFn :()=> dashboardService.getUserDashboard(user.token),
       enabled : !!user?.token,
       refetchOnWindowFocus: true,
       refetchInterval: 30000,
     })
     // Roadmap count fallback (roadmapService unwraps { roadmaps } -> array)
     const {data : roadmapsFallback } = useQuery({
       queryKey :["roadmap"],
       queryFn :()=> roadmapService.getAllRoadmap(user.token),
       enabled : !!user?.token,
     })

     const profile = dashboard?.profile || user
     const stats = dashboard?.stats
     const roadmapsCount = stats?.activeRoadmaps ?? (Array.isArray(roadmapsFallback) ? roadmapsFallback.length : 0)
     const creditBalance = dashboard?.profile?.credits ?? user?.credits ?? 0
     const profileCompletion = stats?.profileCompletion ?? 85


  const hasDashboardData = !!dashboard;

  const fallbackSessions = [
    {
      id: 1,
      counselor: 'Dr. Ramesh Kumar',
      role: 'Ex-Google SDE3 / IIT Bombay Mentor',
      date: 'Tomorrow, 5:00 PM IST',
      topic: 'Full-Stack System Design Mock Interview',
      status: 'Confirmed',
      avatar: 'RK',
    },
    {
      id: 2,
      counselor: 'Ananya Roy',
      role: 'Lead Product Designer @ Swiggy',
      date: 'Saturday, 11:00 AM IST',
      topic: 'UI/UX Portfolio & Case Study Review',
      status: 'Pending Host',
      avatar: 'AR',
    },
  ];

  // Best 3 counselors (reviews + experience) — backend dashboard se
  const upcomingSessions = hasDashboardData
    ? (dashboard.topCounselors || []).map((c) => ({
        id: c.counselorId,
        counselor: c.name,
        role: `${c.category} • ${c.experience}+ yrs exp`,
        date: c.avgRating ? `★ ${c.avgRating} (${c.totalReviews} reviews)` : `${c.experience}+ yrs experience`,
        topic: c.qualification ? `Specialist: ${c.qualification}` : `Top mentor in ${c.category}`,
        status: c.avgRating ? `★ ${c.avgRating}` : 'VERIFIED',
        avatar: c.name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
      }))
    : fallbackSessions;

  // Keep redux wallet in sync with fresh dashboard balance (admin grant / deduct)
  useEffect(() => {
    const fresh = dashboard?.profile?.credits ?? dashboard?.stats?.creditBalance;
    if (typeof fresh === "number" && fresh !== user?.credits) {
      dispatch(updateCredits(fresh));
    }
  }, [dashboard, dispatch, user?.credits]);

  useEffect(()=> {
   if(user?.userType === "ADMIN"){
      navigate("/auth/admin")
   }
    else if(user?.userType ==="COUNSELOR"){
      navigate("/auth/counselor")
   }
    if (isError && error) {
             toast.error(
                 error?.response?.data?.message ||
                 error?.message ||
                 "Something went wrong"
             );
         }
  }, [user, isError, error, navigate])

  // Counselor side se naya message aaye to student ko real-time toast (shared singleton)
  useEffect(() => {
    if (!user?.token) return;
    const socket = getSocket(user.token);
    if (!socket) return;
    const onNewMessage = (msg) => {
      if (String(msg.senderId) === String(user._id)) return;
      toast.success(`💬 New message from ${msg.senderName || "User"}`, { duration: 5000 });
    };
    socket.on("new_message", onNewMessage);
    return () => {
      socket.off("new_message", onNewMessage);
    };
  }, [user?.token, user?._id])


  if(isLoading){
     return(
        <LoadingScreen loadingMessage='Loading Data'/>
  )
  }

  const recentRoadmaps = hasDashboardData
    ? (dashboard.recentRoadmaps || []).map((r) => ({
        id: r._id,
        title: r.title,
        progress: null,
        currentStep: r.excerpt,
        targetSalary: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '',
        badge: 'SAVED TRACK',
      }))
    : [
    {
      id: 'rm-101',
      title: 'Full-Stack Web Dev (MERN + Next.js)',
      progress: 65,
      currentStep: 'Phase 3: Backend APIs & MongoDB Security',
      targetSalary: '₹8L - ₹15L / year',
      badge: 'ACTIVE TRACK',
    },
    {
      id: 'rm-102',
      title: 'Data Analyst & Python PowerBI Path',
      progress: 25,
      currentStep: 'Phase 1: Advanced SQL & Data Cleaning',
      targetSalary: '₹6L - ₹10L / year',
      badge: 'IN PROGRESS',
    },
  ];
  const hasRoadmaps = recentRoadmaps.length > 0;

  const spotlight = dashboard?.spotlightMentor

  return (
    <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
      <Navbar activePage="dashboard" />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeTab="overview" role="student" showMobileNav={false} />

        <main className="flex-1 p-4 sm:p-6 xl:p-8 bg-grid-pattern w-full min-w-0 overflow-y-auto overflow-x-hidden">
          {/* Welcome Banner */}
          <div className="bg-yellow border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop mb-6 xl:mb-8 relative w-full min-w-0 overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
              <div className="min-w-0">
                <div className="inline-block bg-navy text-yellow font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-2">
                  Student Workspace • {profile?.name}
                </div>
                <h1 className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy">
                  Namaste, {profile?.name}! Ready to level up? ⚡
                </h1>
                <p className="font-body text-sm text-navy-muted mt-1">
                  You have <span className="font-bold text-navy">{creditBalance} Credits</span> available. Your Qualification is <span className="font-bold text-black  ">{profile?.qualification}</span>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          <Link to={"/auth/ai-roadmap"} className='font-grotesk tracking-wide rounded-full transition-all active:translate-x-1 active:translate-y-1 active:shadow-none px-4 sm:px-5 xl:px-7 py-2 sm:py-2.5 xl:py-3.5 text-xs sm:text-sm xl:text-base font-extrabold bg-green-200 text-black hover:bg-yellow-fixed border-3 border-navy shadow-pop' >
                  + Generate AI Roadmap
                </Link>
                <Link to={"/auth/profile/chat"} className='font-grotesk tracking-wide rounded-full transition-all active:translate-x-1 active:translate-y-1 active:shadow-none px-4 sm:px-5 xl:px-7 py-2 sm:py-2.5 xl:py-3.5 text-xs sm:text-sm xl:text-base font-extrabold bg-green-200 text-black hover:bg-yellow-fixed border-3 border-navy shadow-pop'>
                  Chat with Mentor
                </Link>
              </div>
            </div>
          </div>

          {/* Profile Section */}


          {/* Key Metrics Grid - laptop par 2-col, bade desktop par 4-col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 xl:mb-8">
            <Card color="white" classNameName="border-3">
              <div className="font-mono text-xs font-bold text-navy-muted uppercase">Active Roadmaps</div>
              <div className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy mt-2">{roadmapsCount} Paths</div>
              <div className="text-xs text-rust font-bold mt-1">{roadmapsCount > 3
  ? "🎯 Strong career planning progress"
  : "💡 Start your next career path"}</div>
            </Card>

            <Card color="white" classNameName="border-3">
              <div className="font-mono text-xs font-bold text-navy-muted uppercase">Booked Sessions</div>
              <div className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy mt-2">{stats?.bookedSessions ?? 2} Chats</div>
              <div className="text-xs text-teal font-bold mt-1">{upcomingSessions.length ? `Latest: ${upcomingSessions[0].counselor}` : 'No chats yet'}</div>
            </Card>

            <Card color="white" classNameName="border-3">
              <div className="font-mono text-xs font-bold text-navy-muted uppercase">Credits Wallet</div>
              <div className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy mt-2">{creditBalance} pts</div>
              <div className="text-xs text-rust font-bold mt-1">{creditBalance > 20 ? "⚡ Plenty of credits available" : "⚠️ Time to refill your wallet"}</div>
            </Card>

            <Card color="yellow" classNameName="border-3">
              <div className="font-mono text-xs font-bold text-navy uppercase">Profile Mastery</div>
              <div className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy mt-2">{profileCompletion}%</div>
              <div className="text-xs text-navy font-bold mt-1">Resume uploaded • College verified</div>
            </Card>
          </div>

          {/* Main Dashboard Grid - laptop par stack, bade desktop par 3-col */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8 w-full min-w-0">
            {/* Left 2 Cols: Active Roadmaps & Sessions */}
            <div className="xl:col-span-2 space-y-6 xl:space-y-8 min-w-0">
              {/* Active Roadmaps Section */}
              <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-6">
                  <div>
                    <h2 className="font-grotesk font-extrabold text-xl text-navy">My AI Career Roadmaps</h2>
                    <p className="font-body text-xs text-navy-muted">Step-by-step guidance powered by real Indian job market data</p>
                  </div>
                  {hasRoadmaps ? (
                    <Link to="/auth/profile/my-roadmaps" className="font-grotesk font-bold text-xs text-rust hover:underline">
                      View All Roadmaps →
                    </Link>
                  ) : (
                    <Link to="/auth/ai-roadmap" className="font-grotesk font-bold text-xs text-rust hover:underline">
                      Generate Roadmap →
                    </Link>
                  )}
                </div>

                {hasRoadmaps ? (
                <div className="space-y-4">
                  {recentRoadmaps.map((rm) => (
                    <div key={rm.id} className="bg-parchment border-3 border-navy rounded-2xl p-5 shadow-pop-sm">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-grotesk font-extrabold text-base text-navy">{rm.title}</span>
                            <StatusBadge text={rm.badge} status="success" />
                          </div>
                          <p className="font-body text-xs text-navy-muted mt-1">
                            Current Stage: <span className="font-bold text-navy">{rm.currentStep}</span>
                          </p>
                        </div>
                        <span className="font-mono text-xs font-bold text-rust bg-rust-container px-2.5 py-1 rounded-full border border-navy">
                          {rm.targetSalary}
                        </span>
                      </div>

                      {typeof rm.progress === 'number' && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs font-mono font-bold mb-1">
                          <span>Overall Progress</span>
                          <span>{rm.progress}%</span>
                        </div>
                        <div className="w-full bg-parchment-dim border-2 border-navy h-4 rounded-full overflow-hidden">
                          <div
                            className="bg-yellow h-full border-r-2 border-navy transition-all"
                            style={{ width: `${rm.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      )}

                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="primary" size="sm">
                          Continue →
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                ) : (
                <div className="bg-parchment border-3 border-navy rounded-2xl p-6 shadow-pop-sm text-center">
                  <p className="font-grotesk font-extrabold text-base text-navy">
                    You have not generated any roadmap yet.
                  </p>
                  <p className="font-body text-xs text-navy-muted mt-1">
                    You can generate your personalized AI career roadmap in just a few steps.
                  </p>
                  <div className="mt-4">
                    <Link
                      to="/auth/ai-roadmap"
                      className="inline-block font-grotesk font-bold text-xs text-navy bg-yellow border-2 border-navy rounded-full px-5 py-2.5 shadow-pop-sm hover:bg-yellow-fixed transition-all"
                    >
                      + Generate My Roadmap
                    </Link>
                  </div>
                </div>
                )}
              </div>

              {/* Upcoming Counseling Sessions */}
              <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-6">
                  <div>
                    <h2 className="font-grotesk font-extrabold text-xl text-navy">Upcoming 1-on-1 Sessions</h2>
                    <p className="font-body text-xs text-navy-muted">Live 1-on-1 mentorship with verified industry leaders</p>
                  </div>
                  <Link to="/auth/counselors" className="font-grotesk font-bold text-xs text-rust hover:underline">
                    Browse Counselors →
                  </Link>
                </div>

                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="bg-sky/20 border-3 border-navy rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-pop-sm">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-sky border-2 border-navy flex items-center justify-center font-grotesk font-extrabold text-lg text-navy shadow-pop-sm">
                          {session.avatar}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-grotesk font-extrabold text-base text-navy">{session.counselor}</h3>
                            <StatusBadge text={session.status} status="info" />
                          </div>
                          <p className="font-mono text-xs text-navy-muted">{session.role}</p>
                          <p className="font-body text-xs font-bold text-rust mt-1">📌 {session.topic}</p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <div className="font-mono text-xs font-bold text-navy mb-2">{session.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Quick Tools & Credit Summary */}
            <div className="space-y-6 xl:space-y-8 min-w-0">
              {/* Credit Wallet Widget */}
              <div className="bg-rust-container border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop relative overflow-hidden">
                <div className="font-mono text-xs font-bold text-navy uppercase tracking-wider mb-1">
                  CREDIT BALANCE
                </div>
                <div className="font-grotesk font-extrabold text-2xl sm:text-3xl lg:text-4xl text-navy">
                  {creditBalance} <span className="text-base font-normal">pts</span>
                </div>
                <p className="font-body text-xs text-navy mt-2">
                  1 Session = 50 Credits • 1 AI Roadmap = 10 Credits
                </p>
                {stats?.pendingCreditRequests ? (
                  <p className="font-body text-xs text-navy mt-1 font-bold">
                    {stats.pendingCreditRequests} top-up request(s) pending approval
                  </p>
                ) : null}

                <div className="mt-4 pt-4 border-t-2 border-navy/20">
                  <Button variant="accent" size="md" classNameName="w-full">
                    Buy Top-Up Credit Pack →
                  </Button>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop">
                <h3 className="font-grotesk font-extrabold text-lg text-navy mb-4">Quick Student Tools</h3>
                <div className="space-y-3">
                  <a
                    href="#"
                    className="block bg-parchment border-2 border-navy p-3 rounded-xl hover:bg-yellow transition-all font-grotesk font-bold text-xs text-navy shadow-pop-sm flex items-center justify-between"
                  >
                    <span>🎯 Explore High Salary Tech Careers</span>
                    <span>→</span>
                  </a>
                  <a
                    href="#"
                    className="block bg-parchment border-2 border-navy p-3 rounded-xl hover:bg-yellow transition-all font-grotesk font-bold text-xs text-navy shadow-pop-sm flex items-center justify-between"
                  >
                    <span>📄 AI Resume Reviewer</span>
                    <span>→</span>
                  </a>
                  <a
                    href="#"
                    className="block bg-parchment border-2 border-navy p-3 rounded-xl hover:bg-yellow transition-all font-grotesk font-bold text-xs text-navy shadow-pop-sm flex items-center justify-between"
                  >
                    <span>💬 Practice Mock Interview Chat</span>
                    <span>→</span>
                  </a>
                  <a
                    href="#"
                    className="block bg-parchment border-2 border-navy p-3 rounded-xl hover:bg-yellow transition-all font-grotesk font-bold text-xs text-navy shadow-pop-sm flex items-center justify-between"
                  >
                    <span>🎓 Apply as Student Ambassador</span>
                    <span>→</span>
                  </a>
                </div>
              </div>

              {/* Recommended Counselor Highlight */}
              <div className="bg-yellow border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop">
                <StatusBadge text="SPOTLIGHT MENTOR" status="success" />
                <h3 className="font-grotesk font-extrabold text-xl text-navy mt-3">{spotlight?.name || 'Sneha Mukherjee'}</h3>
                <p className="font-body text-xs text-navy-muted">{spotlight ? `${spotlight.category} • ${spotlight.experience}+ yrs exp` : 'Senior AI Engineer @ Microsoft Hyderabad'}</p>
                <p className="font-body text-xs text-navy mt-2 italic">
                  {spotlight?.avgRating
                    ? `Rated ${spotlight.avgRating}/5 from ${spotlight.totalReviews} reviews.`
                    : '"Specialized in helping Tier-2 & Tier-3 college students land top product tech roles."'}
                </p>
                <div className="mt-4">
                  <Button variant="primary" size="sm" classNameName="w-full">
                    Book Session (50 Credits)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
