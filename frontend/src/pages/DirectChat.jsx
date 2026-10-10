import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatBubble from "../components/ChatBubble";
import Button from "../components/Button";
import LoadingScreen from "../components/LoadingScreen";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSocket } from "../lib/socket";
import toast from "react-hot-toast";
import messageServices from "../services/messageService";

// Seedha 1-to-1 chat — counselor ke liye direct student chat
export default function DirectChat() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isPeerOnline, setIsPeerOnline] = useState(false);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  // Peer ka naam aur pic: inbox ya messages se resolve
  const { data: inbox } = useQuery({
    queryKey: ["inbox"],
    queryFn: () => messageServices.getInbox(user?.token),
    enabled: !!user?.token,
    retry: false,
  });

  const peer = (Array.isArray(inbox) ? inbox : []).find(
    (c) => String(c.user?._id || c.user) === String(uid)
  );

  const peerName = peer?.user?.name || "Student Chat";
  const peerPic = peer?.user?.profilePic;

  // History: GET /api/messages/:uid — also marks messages as read + emits messages_seen
  const { isLoading: historyLoading } = useQuery({
    queryKey: ["conversation", uid],
    queryFn: async () => {
      const res = await messageServices.getConversation({ token: user?.token, uid });
      setMessages(Array.isArray(res) ? res : []);
      return res;
    },
    enabled: !!user?.token && !!uid,
    retry: false,
  });

  useEffect(() => {
    if (!user?.token || !uid) return;
    const socket = getSocket(user.token);
    if (!socket) return;
    socketRef.current = socket;
    socket.emit("join_room", { senderID: user._id, receiverId: uid });
    const onConnectError = () => toast.error("Chat server unreachable");
    socket.on("connect_error", onConnectError);

    const onReceiverMessage = (msg) => {
      const sId = String(msg.sender?._id || msg.sender);
      const rId = String(msg.receiver?._id || msg.receiver);
      const other = sId === String(user._id) ? rId : sId;
      if (String(other) === String(uid)) {
        setMessages((prev) => [...prev, msg]);
        // Agar hum receiver hain to auto mark seen
        if (rId === String(user._id)) {
          socket.emit("mark_seen", { viewerId: user._id, senderId: sId });
        }
      }
    };
    socket.on("receiver_message", onReceiverMessage);

    // Two-way seen: peer ne hamare message dekhe
    const onSeen = ({ readerId, senderId, seenAt }) => {
      // Update seen status on messages we sent to the reader
      if (String(senderId) === String(user._id) || String(readerId) === String(uid)) {
        setMessages((prev) =>
          prev.map((m) => {
            const mSender = String(m.sender?._id || m.sender);
            const mReceiver = String(m.receiver?._id || m.receiver);
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
      if (String(typer) === String(uid)) {
        setTyping(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTyping(false), 2000);
      }
    };
    socket.on("user_typing", onTyping);
    const onList = ({ onlineUsers: list }) => {
      if (Array.isArray(list)) setIsPeerOnline(list.map(String).includes(String(uid)));
    };
    socket.on("online_list", onList);
    const onOnline = ({ userId: online }) => {
      if (String(online) === String(uid)) setIsPeerOnline(true);
    };
    socket.on("user_online", onOnline);
    const onOffline = ({ userId: offline }) => {
      if (String(offline) === String(uid)) setIsPeerOnline(false);
    };
    socket.on("user_offline", onOffline);
    const onDeleted = ({ messageId }) => {
      if (!messageId) return;
      setMessages((prev) => prev.filter((m) => String(m._id) !== String(messageId)));
    };
    socket.on("message_deleted", onDeleted);
    return () => {
      clearTimeout(typingTimeout.current);
      socket.off("connect_error", onConnectError);
      socket.off("receiver_message", onReceiverMessage);
      socket.off("messages_seen", onSeen);
      socket.off("user_typing", onTyping);
      socket.off("online_list", onList);
      socket.off("user_online", onOnline);
      socket.off("user_offline", onOffline);
      socket.off("message_deleted", onDeleted);
    };
  }, [user?.token, user?._id, uid]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socketRef.current?.emit("send_message", {
      senderID: user._id,
      receiverId: uid,
      content: input.trim(),
    });
    setInput("");
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socketRef.current?.emit("Typing", { senderID: user._id, receiverId: uid });
  };

  const handleClearChat = async () => {
    if (!window.confirm(`Clear chat history with ${peerName}? Ye sirf aapke liye delete hoga.`)) return;
    try {
      await messageServices.clearConversation({ token: user.token, uid });
      setMessages([]);
      toast.success("Chat history cleared");
    } catch {
      toast.error("Could not clear chat history");
    }
  };

  const handleDeleteMessage = async (mid) => {
    try {
      await messageServices.deleteMessage({ token: user.token, mid });
      setMessages((prev) => prev.filter((m) => String(m._id) !== String(mid)));
      toast.success("Message deleted");
    } catch {
      toast.error("Could not delete message");
    }
  };

  if (!uid) {
    return <LoadingScreen loadingMessage="Loading chat..." />;
  }

  // Peer name/pic: first try inbox, then from messages
  const resolvedPeerName =
    peerName !== "Student Chat"
      ? peerName
      : messages.find((m) => String(m.sender?._id || m.sender) !== String(user?._id))?.sender?.name ||
        "Student Chat";

  const resolvedPeerPic =
    peerPic ||
    messages.find((m) => String(m.sender?._id || m.sender) !== String(user?._id))?.sender?.profilePic ||
    null;

  return (
    <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
      <Navbar activePage="dashboard" />
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeTab="counselor_overview" role="counselor" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-grid-pattern w-full min-w-0 overflow-y-auto">
          <div className="mb-4">
            <Link to="/auth/counselor" className="font-grotesk font-bold text-xs text-navy hover:text-rust">
              ← Back to Dashboard
            </Link>
          </div>

          <div className="bg-parchment-card border-4 border-navy rounded-3xl shadow-pop overflow-hidden max-w-3xl mx-auto flex flex-col min-h-[500px] sm:min-h-[600px]">
            <div className="p-3 sm:p-4 border-b-4 border-navy bg-yellow/30 flex flex-col min-[480px]:flex-row min-[480px]:items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-sky border-2 border-navy flex items-center justify-center font-grotesk font-extrabold text-sm text-navy overflow-hidden">
                  {resolvedPeerPic ? (
                    <img src={resolvedPeerPic} alt={resolvedPeerName} className="w-full h-full object-cover" />
                  ) : (
                    resolvedPeerName?.[0] || "S"
                  )}
                </div>
                <div>
                  <h2 className="font-grotesk font-extrabold text-base text-navy">{resolvedPeerName}</h2>
                  <p className="font-mono text-[10px] text-navy-muted">
                    {typing ? "typing..." : isPeerOnline ? "🟢 Online" : "Offline"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClearChat}
                title="Clear chat history"
                className="font-grotesk font-bold text-xs text-red-600 bg-white border-2 border-navy rounded-full px-3 py-1 shadow-pop-sm hover:bg-red-50 transition-all"
              >
                🗑 Clear Chat
              </button>
            </div>

            <div className="p-3 sm:p-6 overflow-y-auto space-y-4 max-h-[460px] bg-grid-pattern flex-1">
              {historyLoading ? (
                <p className="font-body text-xs text-navy-muted text-center">Loading messages...</p>
              ) : messages.length === 0 ? (
                <p className="font-body text-xs text-navy-muted text-center">No messages yet — pehla reply bhejo! 🙏</p>
              ) : (
                messages.map((msg) => {
                  const senderId = typeof msg.sender === "object" && msg.sender !== null ? msg.sender._id : msg.sender;
                  const isSelf = String(senderId) === String(user?._id);
                  const senderName = isSelf
                    ? user?.name || "You"
                    : resolvedPeerName || msg.sender?.name || "Student";
                  const senderPic = isSelf ? user?.profilePic : (resolvedPeerPic || msg.sender?.profilePic);
                  return (
                    <ChatBubble
                      key={msg._id}
                      sender={senderName}
                      profilePic={senderPic}
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
                  placeholder="Reply likho..."
                  className="flex-1 min-w-0 bg-white border-3 border-navy rounded-xl px-3 sm:px-4 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
                />
                <Button variant="primary" size="md" type="submit" classNameName="shrink-0">
                  Send ➔
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
