import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatBubble from "../components/ChatBubble";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { getSocket } from "../lib/socket";
import toast from "react-hot-toast";
import counselorServices from "../services/counselorService";
import messageServices from "../services/messageService";
import LoadingScreen from "../components/LoadingScreen";

export default function ChatPage() {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [activeId, setActiveId] = useState(searchParams.get("user") || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unread, setUnread] = useState({});
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);
  const activeIdRef = useRef(activeId);

  // Keep activeIdRef in sync for use inside socket handlers
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const { data: counselors, isLoading } = useQuery({
    queryKey: ["counselor"],
    queryFn: counselorServices.fetchCounselors,
  });

  const isCounselor = user?.userType === "COUNSELOR";

  const { data: inbox } = useQuery({
    queryKey: ["inbox"],
    queryFn: () => messageServices.getInbox(user?.token),
    enabled: !!user?.token && isCounselor,
    refetchInterval: 10000,
    retry: false,
  });

  const { data: targetUserInfo } = useQuery({
    queryKey: ["targetUser", activeId],
    queryFn: async () => {
      if (!activeId || !user?.token) return null;
      const res = await axios.get(`/api/messages/user-info/${activeId}`, {
        headers: { authorization: `Bearer ${user.token}` },
      });
      return res.data;
    },
    enabled: !!activeId && !!user?.token,
  });

  const partners = useMemo(() => {
    if (isCounselor) {
      const list = Array.isArray(inbox) ? inbox : [];
      const mapped = list.map((chat) => ({
        _id: chat.user?._id || chat.user,
        name: chat.user?.name || "Student",
        profilePic: chat.user?.profilePic,
        category: "Student",
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        unreadCount: chat.unreadCount,
      }));
      if (activeId && !mapped.some((p) => String(p._id) === String(activeId))) {
        mapped.unshift({
          _id: activeId,
          name: targetUserInfo?.name || "Student Chat",
          profilePic: targetUserInfo?.profilePic || null,
          category: "Direct message",
        });
      }
      return mapped;
    }
    if (!Array.isArray(counselors)) return [];
    return counselors
      .filter((c) => c?.status === "accepted" && c?.user?._id !== user?._id)
      .map((c) => ({
        _id: c.user._id,
        name: c.user.name,
        profilePic: c.user.profilePic,
        category: c.category?.title || "Mentor",
        experience: c.experience,
      }));
  }, [counselors, user?._id, isCounselor, inbox, activeId, targetUserInfo]);

  const filtered = useMemo(() => {
    if (!search.trim()) return partners;
    return partners.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()));
  }, [partners, search]);

  const active = useMemo(() => {
    const found = partners.find((p) => String(p._id) === String(activeId)) || null;
    if (found) {
      if ((found.name === "Student Chat" || found.name === "Student") && targetUserInfo?.name) {
        return { ...found, name: targetUserInfo.name, profilePic: targetUserInfo.profilePic || found.profilePic };
      }
      return found;
    }
    if (activeId) {
      return {
        _id: activeId,
        name: targetUserInfo?.name || "Student Chat",
        profilePic: targetUserInfo?.profilePic || null,
        category: "Direct message",
      };
    }
    return null;
  }, [partners, activeId, targetUserInfo]);

  const displayActive = useMemo(() => {
    if (!active) return null;
    if (active.name && active.name !== "Student Chat" && active.name !== "Student") {
      return active;
    }
    for (const m of messages) {
      const senderId = String(m.sender?._id || m.sender);
      if (senderId !== String(user._id) && m.sender?.name) {
        return { ...active, name: m.sender.name, profilePic: m.sender.profilePic || active.profilePic };
      }
      const receiverId = String(m.receiver?._id || m.receiver);
      if (receiverId !== String(user._id) && m.receiver?.name) {
        return { ...active, name: m.receiver.name, profilePic: m.receiver.profilePic || active.profilePic };
      }
    }
    return active;
  }, [active, messages, user._id]);

  // Socket connect (shared singleton — one connection per user)
  useEffect(() => {
    if (!user?.token) return;
    const socket = getSocket(user.token);
    if (!socket) return;
    socketRef.current = socket;
    const onConnectError = () => toast.error("Chat server unreachable");
    socket.on("connect_error", onConnectError);

    const onList = ({ onlineUsers: list }) => {
      if (Array.isArray(list)) setOnlineUsers(list.map(String));
    };
    socket.on("online_list", onList);

    const onReceiverMessage = (msg) => {
      const sId = String(msg.sender?._id || msg.sender);
      const rId = String(msg.receiver?._id || msg.receiver);
      const other = sId === String(user._id) ? rId : sId;
      const currentActiveId = activeIdRef.current;

      if (String(other) === String(currentActiveId)) {
        setMessages((prev) => [...prev, msg]);
        // Auto mark seen via socket if we are the receiver and chat is open
        if (rId === String(user._id)) {
          socket.emit("mark_seen", { viewerId: user._id, senderId: sId });
        }
      } else {
        setUnread((prev) => ({ ...prev, [other]: (prev[other] || 0) + 1 }));
        if (String(rId) === String(user._id)) {
          toast.success(`💬 New message from ${msg.senderName || "User"}`, { duration: 5000 });
        }
      }
    };

    // Personal room notification — dusri chat ka msg ho tab bhi kaun se user ka aaya, pata chale
    const onNewMessage = (msg) => {
      if (String(msg.senderId) === String(user._id)) return;
      const currentActiveId = activeIdRef.current;
      if (String(msg.senderId) === String(currentActiveId)) return; // active chat receiver_message se handle hoga
      setUnread((prev) => ({ ...prev, [msg.senderId]: (prev[msg.senderId] || 0) + 1 }));
      queryClient.invalidateQueries({ queryKey: ["inbox"] });
      toast.success(`💬 New msg from ${msg.senderName || "User"}`, { duration: 5000 });
    };
    socket.on("new_message", onNewMessage);

    // Two-way seen: jab samne wale ne message dekha
    const onSeen = ({ readerId, senderId, seenAt }) => {
      const currentActiveId = activeIdRef.current;
      // Update seen status on messages WE sent to the reader
      if (String(senderId) === String(user._id) || String(readerId) === String(currentActiveId)) {
        setMessages((prev) =>
          prev.map((m) => {
            const mSender = String(m.sender?._id || m.sender);
            const mReceiver = String(m.receiver?._id || m.receiver);
            // Mark our sent messages as seen
            if (mSender === String(user._id) && mReceiver === String(readerId)) {
              return { ...m, isRead: true, seenAt };
            }
            return m;
          })
        );
      }
    };
    socket.on("messages_seen", onSeen);

    const onTyping = ({ userId: typer }) => {
      if (String(typer) === String(activeIdRef.current)) {
        setTypingUser(typer);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTypingUser(null), 2000);
      }
    };
    socket.on("user_typing", onTyping);
    const onOnline = ({ userId: online }) =>
      setOnlineUsers((prev) => (prev.includes(String(online)) ? prev : [...prev, String(online)]));
    socket.on("user_online", onOnline);
    const onOffline = ({ userId: offline }) =>
      setOnlineUsers((prev) => prev.filter((id) => id !== String(offline)));
    socket.on("user_offline", onOffline);
    const onDeleted = ({ messageId }) => {
      if (!messageId) return;
      setMessages((prev) => prev.filter((m) => String(m._id) !== String(messageId)));
    };
    socket.on("message_deleted", onDeleted);
    socket.on("receiver_message", onReceiverMessage);
    return () => {
      clearTimeout(typingTimeout.current);
      socket.off("connect_error", onConnectError);
      socket.off("online_list", onList);
      socket.off("receiver_message", onReceiverMessage);
      socket.off("new_message", onNewMessage);
      socket.off("messages_seen", onSeen);
      socket.off("user_typing", onTyping);
      socket.off("user_online", onOnline);
      socket.off("user_offline", onOffline);
      socket.off("message_deleted", onDeleted);
    };
  }, [user?.token, user?._id]);

  // Join room + load history on select
  useEffect(() => {
    if (!active || !user) return;
    socketRef.current?.emit("join_room", { senderID: user._id, receiverId: active._id });
    setUnread((prev) => ({ ...prev, [active._id]: 0 }));
    setHistoryLoading(true);
    axios
      .get(`/api/messages/${active._id}`, {
        headers: { authorization: `Bearer ${user.token}` },
      })
      .then((res) => setMessages(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error("Could not load chat history"))
      .finally(() => setHistoryLoading(false));
  }, [active?._id]);

  // When user selects a contact on mobile, show the chat panel
  const handleSelectContact = (id) => {
    setActiveId(id);
    setShowMobileChat(true);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !active) return;
    socketRef.current?.emit("send_message", {
      senderID: user._id,
      receiverId: active._id,
      content: input.trim(),
    });
    setInput("");
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    if (active) {
      socketRef.current?.emit("Typing", { senderID: user._id, receiverId: active._id });
    }
  };

  const handleClearChat = async () => {
    if (!active) return;
    if (!window.confirm(`Clear chat history with ${active.name}? Ye sirf aapke liye delete hoga.`)) return;
    try {
      await messageServices.clearConversation({ token: user.token, uid: active._id });
      setMessages([]);
      queryClient.invalidateQueries({ queryKey: ["inbox"] });
      toast.success("Chat history cleared");
    } catch {
      toast.error("Could not clear chat history");
    }
  };

  const handleDeleteMessage = async (mid) => {
    try {
      await messageServices.deleteMessage({ token: user.token, mid });
      setMessages((prev) => prev.filter((m) => String(m._id) !== String(mid)));
      queryClient.invalidateQueries({ queryKey: ["inbox"] });
      toast.success("Message deleted");
    } catch {
      toast.error("Could not delete message");
    }
  };

  if (isLoading) return <LoadingScreen loadingMessage="Loading chats..." />;

  return (
    <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
      <Navbar activePage="messages" />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeTab="messages" role={user?.userType === "COUNSELOR" ? "counselor" : "student"} />

        <main className="flex-1 p-2 sm:p-4 lg:p-8 bg-grid-pattern w-full min-w-0 overflow-y-auto flex">
          <div className="w-full bg-parchment-card border-4 border-navy rounded-3xl shadow-pop flex flex-col lg:flex-row overflow-hidden min-h-[500px] lg:min-h-[650px]">
            {/* Left Chat Sidebar — always visible on lg, conditionally on mobile */}
            <div className={`w-full lg:w-80 border-b-4 lg:border-b-0 lg:border-r-4 border-navy bg-parchment p-4 flex flex-col justify-between ${showMobileChat ? 'hidden lg:flex' : 'flex'}`}>
              <div>
                <div className="font-grotesk font-extrabold text-lg text-navy mb-3">Messages &amp; Chats</div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full bg-white border-2 border-navy rounded-xl px-3 py-2 font-body text-xs text-navy shadow-pop-sm mb-4 focus:outline-none"
                />

                <div className="space-y-2 max-h-[420px] overflow-y-auto">
                  {filtered.map((c) => (
                    <div
                      key={c._id}
                  onClick={() => handleSelectContact(c._id)}
                      className={`p-3 rounded-2xl border-2 border-navy cursor-pointer transition-all ${
                        String(activeId) === String(c._id) ? "bg-yellow shadow-pop-sm" : "bg-white hover:bg-parchment-dim"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-sky border-2 border-navy flex items-center justify-center font-grotesk font-extrabold text-sm text-navy shadow-pop-sm overflow-hidden">
                            {c.profilePic ? (
                              <img src={c.profilePic} alt={c.name} className="w-full h-full object-cover" />
                            ) : (
                              c.name?.[0]
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-grotesk font-extrabold text-sm text-navy">{c.name}</div>
                            <div className="font-mono text-[10px] text-navy-muted truncate max-w-[140px]">
                              {c.lastMessage
                                ? `${c.lastMessage.slice(0, 28)}${c.lastMessage.length > 28 ? "..." : ""}`
                                : `${c.category} • ${onlineUsers.includes(String(c._id)) ? "🟢 Online" : "Offline"}`}
                            </div>
                            {c.lastMessageAt && (
                              <div className="font-mono text-[9px] text-navy-muted">
                                {new Date(c.lastMessageAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            )}
                          </div>
                        </div>
                        {(unread[c._id] || c.unreadCount || 0) > 0 && (
                          <span className="w-5 h-5 rounded-full bg-rust text-white font-mono text-[10px] font-bold flex items-center justify-center border border-navy flex-shrink-0">
                            {unread[c._id] || c.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <p className="font-body text-xs text-navy-muted text-center py-4">No conversations found</p>
                  )}
                </div>
              </div>

              <div className="bg-rust-container border-2 border-navy p-3 rounded-xl mt-4 text-xs font-mono">
                <span className="font-bold text-navy">💡 Quick Tip:</span> Share your GitHub link before every mentorship session.
              </div>
            </div>

            {/* Right Main Chat Window — always visible on lg, conditionally on mobile */}
            <div className={`flex-1 flex flex-col justify-between bg-parchment-card ${showMobileChat ? 'flex' : 'hidden lg:flex'}`}>
              {active ? (
                <>
                  <div className="p-3 sm:p-4 border-b-4 border-navy bg-yellow/30 flex flex-col min-[480px]:flex-row min-[480px]:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      {/* Back button — mobile only */}
                      <button
                        onClick={() => setShowMobileChat(false)}
                        className="lg:hidden shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-navy text-yellow font-bold text-sm border-2 border-navy"
                        aria-label="Back to contacts"
                      >
                        ←
                      </button>
                      <div className="w-10 h-10 rounded-xl bg-sky border-2 border-navy flex items-center justify-center font-grotesk font-extrabold text-sm text-navy overflow-hidden">
                        {displayActive?.profilePic ? (
                          <img src={displayActive.profilePic} alt={displayActive.name} className="w-full h-full object-cover" />
                        ) : (
                          displayActive?.name?.[0] || "S"
                        )}
                      </div>
                      <div>
                        <h2 className="font-grotesk font-extrabold text-base text-navy">{displayActive?.name || "Student"}</h2>
                        <p className="font-mono text-[10px] text-navy-muted">
                          {typingUser ? "typing..." : onlineUsers.includes(String(displayActive?._id)) ? "🟢 Online" : displayActive?.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusBadge text="ACTIVE MENTORSHIP" status="success" />
                      <button
                        onClick={handleClearChat}
                        title="Clear chat history"
                        className="font-grotesk font-bold text-xs text-red-600 bg-white border-2 border-navy rounded-full px-3 py-1 shadow-pop-sm hover:bg-red-50 transition-all"
                      >
                        🗑 Clear Chat
                      </button>
                    </div>
                  </div>

                  <div className="p-3 sm:p-6 overflow-y-auto space-y-4 max-h-[460px] bg-grid-pattern">
                    {historyLoading ? (
                      <p className="font-body text-xs text-navy-muted text-center">Loading messages...</p>
                    ) : messages.length === 0 ? (
                      <p className="font-body text-xs text-navy-muted text-center">
                        No messages yet — say Namaste! 🙏
                      </p>
                    ) : (
                      messages.map((msg) => {
                        const senderId = typeof msg.sender === "object" && msg.sender !== null ? msg.sender._id : msg.sender;
                        const isSelf = String(senderId) === String(user?._id);
                        const otherName = displayActive?.name || (isSelf ? msg.receiver?.name : msg.sender?.name) || "Student";
                        const otherPic = displayActive?.profilePic || (isSelf ? msg.receiver?.profilePic : msg.sender?.profilePic);
                        return (
                          <ChatBubble
                            key={msg._id}
                            sender={isSelf ? user.name : otherName}
                            profilePic={isSelf ? user?.profilePic : otherPic}
                            time={msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}
                            message={msg.content}
                            isSelf={isSelf}
                            isRead={msg.isRead}
                            seenAt={msg.seenAt}
                            onDelete={isSelf ? () => handleDeleteMessage(msg._id) : null}
                          />
                        );
                      })
                    )}
                    <div ref={bottomRef} />
                  </div>

                  <div className="p-3 sm:p-4 border-t-4 border-navy bg-parchment">
                    <form onSubmit={handleSend} className="flex items-center gap-2 sm:gap-3">
                      <input
                        type="text"
                        value={input}
                        onChange={handleTyping}
                        placeholder="Type your message here..."
                        className="flex-1 min-w-0 bg-white border-3 border-navy rounded-xl px-3 sm:px-4 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
                      />
                      <Button variant="primary" size="md" type="submit" classNameName="shrink-0">
                        Send ➔
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
                  <p className="font-grotesk font-extrabold text-lg text-navy-muted text-center">
                    Select a counselor to start chatting 💬
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
