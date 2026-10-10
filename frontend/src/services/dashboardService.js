import axios from "axios";

const authHeader = (token) => ({
  headers: { authorization: `Bearer ${token}` },
});

// GET /api/user/dashboard — aggregated student dashboard
const getUserDashboard = async (token) => {
  const response = await axios.get("/api/user/dashboard", authHeader(token));
  return response.data;
};

const dashboardService = { getUserDashboard };

export default dashboardService;
