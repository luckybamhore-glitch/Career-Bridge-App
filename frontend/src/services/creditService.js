import axios from "axios";

const authHeader = (token) => ({
  headers: { authorization: `Bearer ${token}` },
});

const requestCredits = async ({ token, credits }) => {
  const response = await axios.post("/api/credits", { credits }, authHeader(token));
  return response.data;
};

const fetchHistory = async (token) => {
  const response = await axios.get("/api/credits", authHeader(token));
  return response.data;
};

const creditService = { requestCredits, fetchHistory };

export default creditService;
