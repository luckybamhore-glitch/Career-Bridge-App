import axios from "axios";

const authHeader = (token) => ({
  headers: { authorization: `Bearer ${token}` },
});

// GET /api/messages — inbox: last message per contact + unread count
const getInbox = async (token) => {
  const response = await axios.get("/api/messages", authHeader(token));
  return Array.isArray(response.data) ? response.data : [];
};

// GET /api/messages/:uid — conversation with :uid (also marks messages as read)
const getConversation = async ({ token, uid }) => {
  const response = await axios.get(`/api/messages/${uid}`, authHeader(token));
  return response.data;
};

// POST /api/messages/mark-seen/:uid — mark messages from uid as read
const markSeen = async ({ token, uid }) => {
  const response = await axios.post(`/api/messages/mark-seen/${uid}`, {}, authHeader(token));
  return response.data;
};

// DELETE /api/messages/conversation/:uid — poori chat history clear (sirf mere liye)
const clearConversation = async ({ token, uid }) => {
  const response = await axios.delete(`/api/messages/conversation/${uid}`, authHeader(token));
  return response.data;
};

// DELETE /api/messages/message/:mid — single message delete
const deleteMessage = async ({ token, mid }) => {
  const response = await axios.delete(`/api/messages/message/${mid}`, authHeader(token));
  return response.data;
};

const messageServices = { getConversation, getInbox, clearConversation, deleteMessage, markSeen };

export default messageServices;
