import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatBubble({
  sender,
  time,
  message,
  isSelf = false,
  profilePic = null,
  onDelete = null,
  isAi = false,
  seenAt = null,
  isRead = false,
}) {
  const showAi = isAi || sender === "A.I" || sender === "AI";

  const seenTime = seenAt
    ? new Date(seenAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className={`flex w-full gap-2.5 mb-4 ${isSelf ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar for received messages */}
      {!isSelf && (
        <div className="flex-shrink-0 mt-1">
          {showAi ? (
            <div className="w-8 h-8 rounded-full bg-navy text-yellow border-2 border-navy flex items-center justify-center font-grotesk font-extrabold text-xs shadow-pop-sm">
              AI
            </div>
          ) : profilePic ? (
            <img src={profilePic} alt={sender} className="w-8 h-8 rounded-full object-cover border-2 border-navy shadow-pop-sm" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-sky text-navy border-2 border-navy flex items-center justify-center font-grotesk font-extrabold text-xs shadow-pop-sm uppercase">
              {sender?.[0] || "U"}
            </div>
          )}
        </div>
      )}

      <div className={`flex flex-col max-w-[78%] ${isSelf ? "items-end" : "items-start"}`}>
        {/* Sender Header */}
        <div className={`flex items-center space-x-2 mb-1 px-1 ${isSelf ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
          <span className="font-grotesk font-extrabold text-xs text-navy">
            {isSelf ? "You" : sender}
          </span>
          {time && <span className="font-mono text-[10px] text-navy-muted">{time}</span>}
        </div>

        {/* Message Bubble */}
        <div className="relative group">
          <div
            className={`relative p-3.5 rounded-2xl border-3 border-navy shadow-pop-sm font-body text-sm text-navy break-words ${
              isSelf ? "bg-yellow rounded-tr-none" : "bg-white rounded-tl-none"
            }`}
          >
            {showAi ? (
              <div className="prose prose-sm max-w-none text-navy">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{message}</div>
            )}
          </div>

          {/* Delete button — sirf apne messages par, hover par show hoga */}
          {isSelf && onDelete && (
            <button
              onClick={onDelete}
              title="Delete message"
              className="absolute -top-2 -left-7 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full bg-white border-2 border-navy flex items-center justify-center text-[10px] text-red-500 shadow-pop-sm hover:bg-red-50"
            >
              🗑
            </button>
          )}
        </div>

        {/* Two-way Seen Status — sirf apne sent messages ke neeche */}
        {isSelf && (
          <div className="mt-0.5 px-1">
            {seenTime ? (
              <span className="font-mono text-[10px] text-navy-muted flex items-center gap-0.5">
                <span className="text-blue-500">✓✓</span> Seen at {seenTime}
              </span>
            ) : isRead ? (
              <span className="font-mono text-[10px] text-navy-muted flex items-center gap-0.5">
                <span className="text-blue-500">✓✓</span> Seen
              </span>
            ) : (
              <span className="font-mono text-[10px] text-navy-muted flex items-center gap-0.5">
                <span className="text-gray-400">✓</span> Sent
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
