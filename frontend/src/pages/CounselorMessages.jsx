import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import LoadingScreen from "../components/LoadingScreen";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getSocket } from "../lib/socket";
import toast from "react-hot-toast";
import messageServices from "../services/messageService";

// /auth/counselor/messages — sirf student messages, real-time updates, click → direct chat
export default function CounselorMessages() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const socketRef = useRef(null);
  const [localUnread, setLocalUnread] = useState({});

  const { data: inbox, isLoading } = useQuery({
    queryKey: ["inbox"],
    queryFn: () => messageServices.getInbox(user?.token),
    enabled: !!user?.token,
    refetchInterval: 15000,
    retry: false,
  });

  // Socket: real-time new messages → inbox refetch + unread bump (shared singleton)
  useEffect(() => {
    if (!user?.token) return;
    const socket = getSocket(user.token);
    if (!socket) return;
    socketRef.current = socket;

    const onReceiverMessage = (msg) => {
      const rId = String(msg.receiver?._id || msg.receiver);
      const sId = String(msg.sender?._id || msg.sender);
      // Agar hum receiver hain
      if (rId === String(user._id)) {
        setLocalUnread((prev) => ({ ...prev, [sId]: (prev[sId] || 0) + 1 }));
        // Inbox refresh karo
        queryClient.invalidateQueries({ queryKey: ["inbox"] });
      }
    };
    socket.on("receiver_message", onReceiverMessage);

    // Personal room notification — room join na ho tab bhi counselor tak pahunche
    const onNewMessage = (msg) => {
      if (String(msg.senderId) === String(user._id)) return;
      setLocalUnread((prev) => ({ ...prev, [msg.senderId]: (prev[msg.senderId] || 0) + 1 }));
      queryClient.invalidateQueries({ queryKey: ["inbox"] });
      toast.success(`💬 New msg from ${msg.senderName || "User"}`, { duration: 5000 });
    };
    socket.on("new_message", onNewMessage);

    // Seen event: unread clear karo
    const onSeen = ({ readerId, senderId }) => {
      if (String(senderId) === String(user._id)) {
        setLocalUnread((prev) => ({ ...prev, [readerId]: 0 }));
      }
    };
    socket.on("messages_seen", onSeen);

    const onDeleted = () => {
      queryClient.invalidateQueries({ queryKey: ["inbox"] });
    };
    socket.on("message_deleted", onDeleted);

    return () => {
      socket.off("receiver_message", onReceiverMessage);
      socket.off("new_message", onNewMessage);
      socket.off("messages_seen", onSeen);
      socket.off("message_deleted", onDeleted);
    };
  }, [user?.token, user?._id, queryClient]);

  const openStudentChat = (studentId) => {
    setLocalUnread((prev) => ({ ...prev, [String(studentId)]: 0 }));
    navigate(`/auth/profile/chat/${studentId}`);
  };

  if (isLoading) {
    return <LoadingScreen loadingMessage="Loading Student Messages" />;
  }

  return (
    <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
      <Navbar activePage="dashboard" />
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeTab="counselor_messages" role="counselor" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-grid-pattern w-full min-w-0 overflow-y-auto">
          <div className="mb-4">
            <Link to="/auth/counselor" className="font-grotesk font-bold text-xs text-navy hover:text-rust">
              ← Back to My Details
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy">Student Messages</h1>
            <p className="font-body text-sm text-navy-muted mt-1">
              Kisi message par click karo — seedha us student ka chat khulega.
            </p>
          </div>

          <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop max-w-3xl">
            {inbox && inbox.length > 0 ? (
              <div className="space-y-3">
                {inbox.map((chat) => {
                  const sid = chat.user?._id || chat.user;
                  const totalUnread = (chat.unreadCount || 0) + (localUnread[String(sid)] || 0);
                  const msgTime = chat.lastMessageAt
                    ? new Date(chat.lastMessageAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                    : null;
                  return (
                    <div
                      key={sid}
                      onClick={() => openStudentChat(sid)}
                      className="bg-parchment border-3 border-navy p-4 rounded-2xl shadow-pop-sm cursor-pointer hover:bg-parchment-dim transition-all"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-sky border-2 border-navy flex items-center justify-center font-grotesk font-extrabold text-sm text-navy overflow-hidden flex-shrink-0">
                            {chat.user?.profilePic ? (
                              <img src={chat.user.profilePic} alt={chat.user.name} className="w-full h-full object-cover" />
                            ) : (
                              chat.user?.name?.[0] || "S"
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-grotesk font-extrabold text-base text-navy">{chat.user?.name || "Student"}</span>
                              {totalUnread > 0 && (
                                <span className="w-5 h-5 rounded-full bg-rust text-white font-mono text-[10px] font-bold flex items-center justify-center border border-navy flex-shrink-0">
                                  {totalUnread}
                                </span>
                              )}
                            </div>
                            {/* Student ka last message dikhao, na ki counselor ka own message */}
                            {chat.lastMessage && (
                              <p className="font-body text-xs text-navy-muted mt-0.5 truncate max-w-[280px]">
                                &ldquo;{chat.lastMessage}&rdquo;
                              </p>
                            )}
                            {msgTime && (
                              <p className="font-mono text-[10px] text-navy-muted mt-0.5">{msgTime}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openStudentChat(sid);
                          }}
                        >
                          Open Chat →
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="font-body text-xs text-navy-muted">
                Abhi kisi student ne message nahi kiya. Message aate hi yahan dikhega.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
