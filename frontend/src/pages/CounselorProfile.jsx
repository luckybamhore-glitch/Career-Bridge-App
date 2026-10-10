import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import LoadingScreen from '../components/LoadingScreen';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import counselorServices from '../services/counselorService';
import ratingServices from '../services/ratingService';
import useOnlineUsers from '../hooks/useOnlineUsers';
import { setCounselor } from '../features/counselor/counselor';

function OnlineBadge({ userId, token }) {
  const onlineUsers = useOnlineUsers(token);
  const online = onlineUsers.includes(String(userId));
  return (
    <span
      title={online ? 'Online now' : 'Offline'}
      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-navy ${online ? 'bg-green-200 text-green-900' : 'bg-gray-200 text-gray-600'}`}
    >
      {online ? '🟢 ONLINE' : 'OFFLINE'}
    </span>
  );
}

export default function CounselorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { user } = useSelector((state) => state.auth);
  const { counselors } = useSelector((state) => state.counselor);

  const [rating, setRating] = useState('5');
  const [review, setReview] = useState('');

  // Ensure list is loaded when landing directly on profile URL
  const listQuery = useQuery({
    queryKey: ['counselor'],
    queryFn: counselorServices.fetchCounselors,
    enabled: !counselors || counselors.length === 0,
  });

  useEffect(() => {
    if (listQuery.isSuccess && listQuery.data) {
      dispatch(setCounselor(listQuery.data));
    }
  }, [listQuery.isSuccess, listQuery.data, dispatch]);

  const counselor = (counselors || listQuery.data || []).find(
    (c) => String(c._id) === String(id)
  );

  // Ratings for this counselor (client-filtered, see ratingService note)
  const {
    data: ratings,
    isLoading: ratingsLoading,
  } = useQuery({
    queryKey: ['ratings', id],
    queryFn: () =>
      ratingServices.fetchRatings({ token: user?.token, counselorId: id }),
    enabled: !!user?.token && !!id,
    retry: false,
  });

  // POST /api/rating/:counselorId { rating 1-5, review }
  const addRatingMutation = useMutation({
    mutationFn: ({ rating, review }) =>
      ratingServices.addRating({ token: user?.token, counselorId: id, rating: Number(rating), review }),
    onSuccess: () => {
      toast.success('Review submitted!');
      setReview('');
      queryClient.invalidateQueries({ queryKey: ['ratings', id] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Review failed');
    },
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!review.trim()) {
      toast.error('Please write a review');
      return;
    }
    if (!user?.token) {
      toast.error('Please login again');
      return;
    }
    addRatingMutation.mutate({ rating, review: review.trim() });
  };

  const handleChatNow = () => {
    const counselorUserId =
      typeof counselor?.user === 'object' ? counselor?.user?._id : counselor?.user;
    if (counselorUserId) {
      navigate(`/auth/profile/chat?user=${counselorUserId}`);
    } else {
      navigate('/auth/profile/chat');
    }
  };

  if (listQuery.isLoading && !counselor) {
    return <LoadingScreen loadingMessage="Loading Counselor Profile" />;
  }

  if (!counselor) {
    return (
      <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
        <Navbar activePage="counselors" />
        <div className="flex-1 flex flex-col md:flex-row">
          <Sidebar activeTab="counselors" role="student" />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-grid-pattern w-full min-w-0 overflow-y-auto">
            <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 lg:p-8 shadow-pop text-center">
              <h1 className="font-grotesk font-extrabold text-2xl text-navy">Counselor not found</h1>
              <p className="font-body text-sm text-navy-muted mt-2">
                This profile may be pending admin approval or the link is invalid.
              </p>
              <div className="mt-4">
                <Button variant="primary" size="md" type="button" clickAction={() => navigate('/auth/counselors')}>
                  ← Back to Counselor List
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const avgRating =
    ratings && ratings.length > 0
      ? (ratings.reduce((s, r) => s + Number(r.rating || 0), 0) / ratings.length).toFixed(1)
      : null;

  const initials = (counselor?.user?.name || 'C')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
      <Navbar activePage="counselors" />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeTab="counselors" role="student" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-grid-pattern w-full min-w-0 overflow-y-auto">
          {/* Back Button */}
          <div className="mb-4">
            <Link to="/auth/counselors" className="font-grotesk font-bold text-xs text-navy hover:text-rust flex items-center space-x-1">
              <span>← Back to Counselor List</span>
            </Link>
          </div>

          {/* Profile Banner — real backend data */}
          <div className="bg-yellow border-4 border-navy rounded-3xl p-4 sm:p-6 lg:p-8 shadow-pop mb-8 relative">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-parchment-card border-4 border-navy flex items-center justify-center font-grotesk font-extrabold text-2xl text-navy shadow-pop overflow-hidden">
                  {counselor?.user?.profilePic ? (
                    <img className="w-16 h-16 sm:w-20 sm:h-20 object-cover" src={counselor.user.profilePic} alt={counselor.user.name} />
                  ) : (
                    initials
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-0 sm:space-x-3 mb-1">
                    <h1 className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy">{counselor?.user?.name}</h1>
                    {counselor?.status === 'accepted' && (
                      <StatusBadge text="VERIFIED MENTOR" status="success" />
                    )}
                    <OnlineBadge userId={counselor?.user?._id} token={user?.token} />
                  </div>
                  <p className="font-mono text-sm font-bold text-navy-muted">
                    {counselor?.user?.qualification} • {counselor?.category?.title}
                  </p>
                  <p className="font-body text-xs text-navy mt-1">
                    📍 {counselor?.user?.location || 'India'} • {counselor?.experience} Years Experience
                    {avgRating ? ` • ★ ${avgRating} (${ratings.length} reviews)` : ' • No reviews yet'}
                  </p>
                </div>
              </div>

              <div className="bg-parchment-card border-3 border-navy p-4 rounded-2xl shadow-pop-sm text-center">
                <div className="font-mono text-[10px] font-bold text-navy-muted uppercase">Availability</div>
                <div className="font-grotesk font-extrabold text-2xl text-rust">
                  {counselor?.isAvailable ? 'Available' : 'Busy'}
                </div>
                <div className="font-mono text-[10px] font-bold text-navy mt-0.5">
                  Status: {counselor?.status}
                </div>
              </div>
            </div>
          </div>

          {/* 2 Col Grid: Details & Reviews */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Bio & Reviews */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop">
                <h2 className="font-grotesk font-extrabold text-xl text-navy mb-3">About {counselor?.user?.name}</h2>
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2 mb-4 font-mono text-xs">
                  <div className="bg-parchment border-2 border-navy p-2.5 rounded-xl text-navy">
                    Category: <span className="font-bold">{counselor?.category?.title}</span>
                  </div>
                  <div className="bg-parchment border-2 border-navy p-2.5 rounded-xl text-navy">
                    Experience: <span className="font-bold">{counselor?.experience} yrs</span>
                  </div>
                  <div className="bg-parchment border-2 border-navy p-2.5 rounded-xl text-navy">
                    Qualification: <span className="font-bold">{counselor?.user?.qualification}</span>
                  </div>
                  <div className="bg-parchment border-2 border-navy p-2.5 rounded-xl text-navy">
                    Location: <span className="font-bold">{counselor?.user?.location}</span>
                  </div>
                </div>
              </div>

              {/* Reviews Section — GET /api/rating/:id */}
              <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop">
                <h2 className="font-grotesk font-extrabold text-xl text-navy mb-4">Student Reviews & Ratings</h2>
                {ratingsLoading ? (
                  <p className="font-body text-xs text-navy-muted">Loading reviews...</p>
                ) : ratings && ratings.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {ratings.map((rev) => (
                      <div key={rev._id} className="bg-parchment border-2 border-navy p-4 rounded-2xl shadow-pop-sm">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-1">
                          <span className="font-grotesk font-bold text-sm text-navy">{rev.user?.name || 'Student'}</span>
                          <span className="font-mono text-xs font-bold text-rust">{rev.rating} ★</span>
                        </div>
                        <p className="font-body text-xs text-navy-muted">"{rev.review}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-xs text-navy-muted mb-6">No reviews yet for this counselor. Be the first!</p>
                )}

                {/* Add review — POST /api/rating/:counselorId */}
                <form onSubmit={handleReviewSubmit} className="border-t-2 border-navy/20 pt-4 space-y-3">
                  <h3 className="font-grotesk font-bold text-sm text-navy">Write a review</h3>
                  <div className="flex items-center space-x-3">
                    <label className="font-mono text-xs font-bold text-navy">Rating (1-5):</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="bg-parchment border-2 border-navy rounded-xl px-3 py-2 font-body text-xs text-navy focus:outline-none"
                    >
                      <option value="1">1 ★</option>
                      <option value="2">2 ★★</option>
                      <option value="3">3 ★★★</option>
                      <option value="4">4 ★★★★</option>
                      <option value="5">5 ★★★★★</option>
                    </select>
                  </div>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Apna experience likho..."
                    rows={3}
                    className="w-full bg-parchment border-2 border-navy rounded-xl px-3 py-2 font-body text-xs text-navy focus:outline-none"
                  />
                  <Button variant="accent" size="md" type="submit">
                    {addRatingMutation.isPending ? 'SUBMITTING...' : 'SUBMIT REVIEW →'}
                  </Button>
                  <p className="font-body text-[11px] text-navy-muted">Note: backend allows 1 review per user total.</p>
                </form>
              </div>
            </div>

            {/* Right 1 Col: Contact */}
            <div className="space-y-8">
              <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop">
                <h3 className="font-grotesk font-extrabold text-lg text-navy mb-1">Contact Counselor</h3>
                <p className="font-body text-xs text-navy-muted mb-4">Start a 1-on-1 chat with {counselor?.user?.name}:</p>

                <div className="bg-rust-container border-2 border-navy p-3 rounded-xl mb-4 font-mono text-xs flex justify-between items-center">
                  <span>Your Credit Balance:</span>
                  <span className="font-bold text-navy">{user?.credits ?? 0} Credits</span>
                </div>

                <Button variant="accent" size="lg" type="button" classNameName="w-full" clickAction={handleChatNow}>
                  CHAT NOW →
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
