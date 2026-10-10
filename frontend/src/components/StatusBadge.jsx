export default function StatusBadge({ text, status = 'info' }) {
  const styles = {
    info: 'bg-teal-container text-navy border-navy',
    success: 'bg-yellow text-navy border-navy font-black',
    warning: 'bg-orange text-white border-navy',
    danger: 'bg-rust text-white border-navy',
    purple: 'bg-sky text-navy border-navy',
  };

  return (
    <span
      className={`inline-block font-mono text-[11px] uppercase tracking-wider px-2.5 py-0.5 border-2 shadow-pop-sm rounded-full ${styles[status]}`}
    >
      {text}
    </span>
  );
}
