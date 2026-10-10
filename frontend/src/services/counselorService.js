import axios from "axios";

const authHeader = (token) => ({
  headers: {
    authorization: `Bearer ${token}`,
  },
});

// GET /api/counselor/categories
const fetchCategories = async () => {
  const response = await axios.get("/api/counselor/categories");
  return response.data;
};

// GET /api/counselor -> returns all, caller filters status === "accepted"
// Backend bug: computes activeCounselor but returns all, so filter client-side.
const fetchCounselors = async () => {
  const response = await axios.get("/api/counselor");
  return response.data;
};

// POST /api/counselor { category: ObjectId, experience: Number>=2 }
const becomeCounselor = async ({ token, category, experience }) => {
  const response = await axios.post(
    "/api/counselor",
    { category, experience: Number(experience) },
    authHeader(token)
  );
  return response.data;
};

const counselorServices = { fetchCounselors, fetchCategories, becomeCounselor };

export default counselorServices;
