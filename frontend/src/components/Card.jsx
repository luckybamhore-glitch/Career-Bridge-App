export default function Card({ children, classNameName = '', color = 'white' }) {
  const bgStyles = {
    white: 'bg-parchment-card',
    yellow: 'bg-yellow',
    sky: 'bg-sky/20',
    rust: 'bg-rust-container',
    teal: 'bg-teal-container',
  };

  return (
    <div
      className={`border-3 border-navy shadow-pop p-4 sm:p-6 rounded-2xl ${bgStyles[color] || 'bg-parchment-card'} ${classNameName}`}
    >
      {children}
    </div>
  );
}
