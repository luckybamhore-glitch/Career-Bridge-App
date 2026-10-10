import { LogOut, Menu, X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logOutUser } from "../features/auth/authSlice";
import { disconnectSocket } from "../lib/socket";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close mobile menu on route change or when screen becomes desktop
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    disconnectSocket();
    dispatch(logOutUser());
    localStorage.removeItem("user");
    navigate("/");
  };

  const studentNav = [
    { id: 'overview', label: 'My Dashboard', link: "/auth/profile", icon: '📊' },
    { id: 'roadmap', label: 'My Roadmaps', link: "/auth/profile/my-roadmaps", icon: '⚡' },
    { id: 'messages', label: 'Messages & Chat', link: "/auth/profile/chat", icon: '💬' },
    { id: 'credits', label: 'My Credits & Wallet', link: "/auth/profile/my-credits", icon: '🪙' },
    { id: 'become_counselor', label: 'Join as Counselor', link: "/auth/profile/become-counselor", icon: '🎓' },
    { id: 'careers', label: 'Career Explorer', link: "/auth/careers", icon: '🧭' },
    { id: 'counselors', label: 'Find Counselors', link: "/auth/counselors", icon: '🧑‍🏫' },
  ];

  const adminNav = [
    { id: 'admin_overview', label: 'System Overview', link: "/auth/admin", icon: '🛡️' },
    { id: 'admin_users', label: 'User Directory', link: "/auth/admin/users", icon: '👥' },
    { id: 'admin_categories', label: 'Categories & Tags', link: "/auth/admin/categories", icon: '🏷️' },
    { id: 'admin_approvals', label: 'Counselor Approvals', link: "/auth/admin/approvals", icon: '📝' },
    { id: 'admin_credit_requests', label: 'Credit Requests', link: "/auth/admin/credits_requests", icon: '💳' },
    { id: 'admin_ai', label: 'AI Prompt Engine', link: "/auth/admin/ai", icon: '🤖' },
  ];

  const counselorNav = [
    { id: 'counselor_overview', label: 'My Details', link: '/auth/counselor', icon: '📈' },
    { id: 'counselor_messages', label: 'Student Messages', link: '/auth/counselor/messages', icon: '💬' },
    { id: 'counselor_reviews', label: 'My Reviews', link: '/auth/counselor/reviews', icon: '⭐' },
  ];

  const navItems = user?.userType === 'ADMIN'
    ? adminNav
    : user?.userType === 'COUNSELOR'
      ? counselorNav
      : studentNav;

  return (
    <>
      <header className="w-full bg-parchment-card border-b-4 border-navy px-3 sm:px-4 lg:px-8 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Logo & Mobile Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            {/* Hamburger Button (Mobile only) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 bg-yellow border-2 border-navy rounded-lg shadow-pop-sm active:translate-x-0.5 active:translate-y-0.5 transition-all text-navy hover:bg-yellow-fixed shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link to="/" className="flex items-center gap-2 sm:space-x-2 group min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 bg-yellow border-3 border-navy shadow-pop flex items-center justify-center font-grotesk font-extrabold text-lg sm:text-xl text-navy">
                CB
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-grotesk font-extrabold text-base sm:text-xl tracking-tight text-navy leading-none truncate">
                  CAREER<span className="text-rust">BRIDGE</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-navy-muted tracking-wider uppercase">
                  India Platform v2.4
                </span>
              </div>
            </Link>
          </div>

          {/* Right Widgets */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Profile Avatar */}
            <div className="flex items-center space-x-2 bg-sky/30 border-2 border-navy px-2.5 py-1 rounded-full shadow-pop-sm hover:bg-sky/50">
              <div className="w-7 h-7 rounded-full bg-sky border border-navy flex items-center justify-center font-grotesk font-bold text-xs text-navy overflow-hidden">
                {user?.profilePic ? (
                  <img src={user.profilePic} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0] || "U"
                )}
              </div>
              <span className="hidden sm:inline font-grotesk font-bold text-xs text-navy">
                {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="hidden md:flex group items-center space-x-2 bg-red-500 border-2 border-navy px-2.5 py-1 rounded-full shadow-pop-sm hover:bg-red-300 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-red-400 border border-navy flex items-center justify-center font-grotesk font-bold text-xs text-navy">
                <LogOut height={18} />
              </div>
              <span className="hidden sm:inline font-grotesk font-bold text-xs text-white">
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer / Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col pt-[58px]">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-navy/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Drawer Content */}
          <div className="relative z-50 w-full max-h-[calc(100vh-65px)] bg-parchment-card border-b-4 border-navy shadow-pop-lg flex flex-col overflow-y-auto">
            {/* User badge */}
            <div className="p-4 border-b-2 border-navy/20 bg-parchment flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky border-2 border-navy flex items-center justify-center font-grotesk font-bold text-sm text-navy overflow-hidden shadow-pop-sm">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.[0] || "U"
                  )}
                </div>
                <div>
                  <div className="font-grotesk font-extrabold text-sm text-navy leading-tight">
                    {user?.name || "User"}
                  </div>
                  <div className="font-mono text-[10px] font-bold text-navy-muted">
                    {user?.email || (user?.userType ? `${user.userType} Account` : '')}
                  </div>
                </div>
              </div>
              <span className="font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-navy bg-yellow text-navy">
                {user?.userType || 'USER'}
              </span>
            </div>

            {/* Nav items */}
            <div className="p-3 space-y-2">
              <p className="px-2 pt-1 font-mono text-[11px] font-extrabold uppercase text-navy-muted tracking-wider">
                {user?.userType === 'ADMIN' ? 'Admin Menu' : user?.userType === 'COUNSELOR' ? 'Counselor Menu' : 'Navigation Menu'}
              </p>
              {navItems.map((item) => {
                const isActive = location.pathname === item.link;
                return (
                  <Link
                    key={item.id}
                    to={item.link}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl border-2 border-navy font-grotesk font-bold text-sm transition-all ${isActive
                        ? "bg-yellow text-navy shadow-pop-sm translate-x-0.5"
                        : "bg-parchment text-navy hover:bg-parchment-dim"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight size={16} className={`opacity-60 ${isActive ? 'text-navy font-bold' : ''}`} />
                  </Link>
                );
              })}
            </div>

            {/* Logout Option in mobile menu */}
            <div className="p-3 pt-1 border-t-2 border-navy/20">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white border-2 border-navy py-2.5 px-4 rounded-xl font-grotesk font-bold text-sm shadow-pop-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

