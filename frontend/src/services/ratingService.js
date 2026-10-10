import axios from "axios";

const authHeader = (token) => ({
  headers: {
    authorization: `Bearer ${token}`,
  },
});

// POST /api/rating/:counselorId { rating: 1-5, review }
const addRating = async ({ token, counselorId, rating, review }) => {
  const response = await axios.post(
    `/api/rating/${counselorId}`,
    { rating, review },
    authHeader(token)
  );
  return response.data;
};

// GET /api/rating/:counselorId
// NOTE backend bug: controller uses req.params.cind instead of cnid,
// so it returns ALL ratings. Caller must filter by counselor._id client-side.
const fetchRatings = async ({ token, counselorId }) => {
  const response = await axios.get(
    `/api/rating/${counselorId}`,
    authHeader(token)
  );
  const all = Array.isArray(response.data) ? response.data : [];
  return all.filter((r) => {
    const cid =
      typeof r.counselor === "object" && r.counselor !== null
        ? r.counselor._id || r.counselor
        : r.counselor;
    return String(cid) === String(counselorId);
  });
};

const ratingServices = { addRating, fetchRatings };

export default ratingServices;
