export default function TypingBubble() {
  return (
    <div className="group flex w-full gap-2.5 mb-4 flex-row">
      <div className="flex-shrink-0 mt-0.5">
        <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
          <span className="font-sans font-semibold text-[11px] text-white tracking-tight">
            AI
          </span>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
        </div>
      </div>

      <div className="flex flex-col max-w-[78%] items-start">
        <div className="rounded-[20px] rounded-tl-md bg-white border border-slate-200/80 shadow-sm px-4 py-3.5">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}