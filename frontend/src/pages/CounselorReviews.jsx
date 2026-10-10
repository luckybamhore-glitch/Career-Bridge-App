import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingScreen from '../components/LoadingScreen';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import counselorServices from '../services/counselorService';
import ratingServices from '../services/ratingService';
import { setCounselor } from '../features/counselor/counselor';

// /auth/counselor/reviews — sirf apne reviews, click → us student ka chat
export default function CounselorReviews() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { counselors } = useSelector((state) => state.counselor);

  const { data, isLoading: listLoading } = useQuery({
    queryKey: ['counselor'],
    queryFn: counselorServices.fetchCounselors,
    enabled: !counselors || counselors.length === 0,
  });

  useEffect(() => {
    if (data) dispatch(setCounselor(data));
  }, [data, dispatch]);

  const list = counselors || data || [];

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

  // const openStudentChat = (studentId) => {
  //   if (studentId) navigate(`/auth/profile/chat/${studentId}`);
  // };
//  const openStudentChat = (studentId) => {
//     if (studentId) {
//       navigate(`/auth/profile/chat?user=${studentId}`);
//     } else {
//       navigate(`/auth/counselor/messages`);
//     }
//   };

  if (listLoading && !counselors) {
    return <LoadingScreen loadingMessage="Loading Reviews" />;
  }

  return (
    <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
      <Navbar activePage="dashboard" />
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeTab="counselor_reviews" role="counselor" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-grid-pattern w-full min-w-0 overflow-y-auto">
          <div className="mb-4">
            <Link to="/auth/counselor" className="font-grotesk font-bold text-xs text-navy hover:text-rust">
              ← Back to My Details
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy">My Student Reviews</h1>
            <p className="font-body text-sm text-navy-muted mt-1">
              Kisi review par click karo — us student ka chat khulega.
            </p>
          </div>

          <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop max-w-3xl">
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
                      onClick={() => reviewerId && openStudentChat(reviewerId)}
                      className="bg-parchment border-2 border-navy p-4 rounded-2xl shadow-pop-sm cursor-pointer hover:bg-parchment-dim transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-1">
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
        </main>
      </div>
    </div>
  );
}
