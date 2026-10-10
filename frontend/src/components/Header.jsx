import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X, ArrowRight, Compass, Users, Sparkles, Coins, LogIn, UserPlus, User } from 'lucide-react';

export const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getProfilePath = () => {
    if (user?.userType === 'ADMIN') return '/auth/admin';
    if (user?.userType === 'COUNSELOR') return '/auth/counselor';
    return '/auth/profile';
  };

  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.userType === 'ADMIN') return 'Admin';
    if (user?.userType === 'COUNSELOR') return 'Counselor';
    return 'User';
  };

  const getRoleLabel = () => {
    if (user?.userType === 'ADMIN') return 'Admin';
    if (user?.userType === 'COUNSELOR') return 'Counselor';
    return 'Student';
  };

  // Close mobile menu on route change or screen resize
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

  const navLinks = [
    { label: 'How It Works', targetId: 'how-it-works', href: '/how-it-works', icon: Sparkles },
    { label: 'For Mentors', targetId: 'audiences', href: '/#audiences', icon: Users },
    { label: 'Directory Preview', targetId: 'previews', href: '/#previews', icon: Compass },
    { label: 'Credits & Pricing', targetId: 'credits', href: '/#credits', icon: Coins },
  ];

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname === '/') {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${targetId}`);
      }
    } else {
      navigate(`/#${targetId}`);
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  return (
    <>
      <header className="w-full bg-navy text-white px-3 sm:px-6 lg:px-12 py-3 sm:py-4 border-b-2 border-navy sticky top-0 z-50 shadow-pop-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Brand Logo & Mobile Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 bg-yellow border-2 border-navy rounded-lg shadow-pop-sm active:translate-x-0.5 active:translate-y-0.5 transition-all text-navy hover:bg-yellow-fixed shrink-0"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link to="/" className="flex items-center gap-2 sm:space-x-3 group min-w-0">
              <div className="w-9 h-9 shrink-0 bg-yellow border-2 border-navy text-navy font-grotesk font-extrabold text-base sm:text-lg flex items-center justify-center shadow-pop-sm">
                CB
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-grotesk font-extrabold text-base sm:text-xl tracking-tight text-white leading-none truncate">
                  CAREER<span className="text-yellow">BRIDGE</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-parchment-dim tracking-wider uppercase">
                  India Guidance Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center gap-6 font-grotesk font-medium text-sm text-parchment-dim">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.targetId)}
                className="hover:text-yellow transition-colors cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <Link
                to={getProfilePath()}
                className="bg-yellow hover:bg-yellow-fixed text-navy font-grotesk font-extrabold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-navy shadow-pop-sm active:translate-x-0.5 active:translate-y-0.5 transition-all whitespace-nowrap flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-sky border border-navy flex items-center justify-center font-grotesk font-bold text-xs text-navy overflow-hidden shrink-0">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt={getDisplayName()} className="w-full h-full object-cover" />
                  ) : (
                    getDisplayName()?.[0] || (user?.userType === 'ADMIN' ? 'A' : user?.userType === 'COUNSELOR' ? 'C' : 'U')
                  )}
                </div>
                <div className="flex flex-col items-start leading-tight text-left">
                  <span className="font-grotesk font-extrabold text-xs text-navy truncate max-w-[120px] sm:max-w-[160px]">
                    {getDisplayName()}
                  </span>
                  <span className="font-mono text-[9px] font-bold text-navy/70 uppercase">
                    {getRoleLabel()} • Back to Profile →
                  </span>
                </div>
              </Link>
            ) : (
              <>
                {location.pathname !== '/login' && (
                  <Link
                    to="/login"
                    className="font-grotesk font-bold text-xs sm:text-sm text-parchment-dim hover:text-white px-2 sm:px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Log In
                  </Link>
                )}
                {location.pathname !== '/register' && (
                  <Link
                    to="/register"
                    className="bg-rust text-white font-grotesk font-bold text-[11px] sm:text-xs px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-navy shadow-pop-sm hover:bg-rust/90 active:translate-x-0.5 active:translate-y-0.5 transition-all whitespace-nowrap flex items-center gap-1"
                  >
                    <span>Get Started</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col pt-[58px]">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-navy/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Drawer Content */}
          <div className="relative z-50 w-full bg-navy border-b-4 border-navy shadow-pop-lg flex flex-col overflow-y-auto max-h-[calc(100vh-65px)]">
            <div className="p-4 space-y-2">
              <p className="px-2 pt-1 font-mono text-[11px] font-extrabold uppercase text-parchment-dim tracking-wider">
                Menu & Exploration
              </p>
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.targetId)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-navy-light bg-navy-light/60 hover:bg-navy-light text-white font-grotesk font-bold text-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-yellow" />
                      <span>{item.label}</span>
                    </div>
                    <ArrowRight size={14} className="text-parchment-dim opacity-70" />
                  </a>
                );
              })}
            </div>

            {/* Auth Buttons */}
            <div className="p-4 pt-2 border-t border-navy-light flex flex-col gap-2.5">
              {user ? (
                <Link
                  to={getProfilePath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between gap-2 bg-yellow hover:bg-yellow-fixed text-navy border-2 border-navy py-2.5 px-4 rounded-xl font-grotesk font-bold text-sm shadow-pop-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-sky border border-navy flex items-center justify-center font-bold text-xs text-navy shrink-0 overflow-hidden">
                      {user?.profilePic ? (
                        <img src={user.profilePic} alt={getDisplayName()} className="w-full h-full object-cover" />
                      ) : (
                        getDisplayName()?.[0] || 'U'
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="font-extrabold truncate text-sm">{getDisplayName()}</span>
                      <span className="font-mono text-[10px] text-navy/70 uppercase font-bold">
                        {getRoleLabel()} • Back to Profile
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="shrink-0" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center justify-center gap-2 border-2 border-yellow text-yellow bg-navy py-2.5 px-4 rounded-xl font-grotesk font-bold text-sm shadow-pop-sm active:translate-x-0.5 active:translate-y-0.5 transition-all ${location.pathname === '/login' ? 'bg-yellow/10 ring-2 ring-yellow' : ''
                      }`}
                  >
                    <LogIn size={16} />
                    <span>Log In</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-rust hover:bg-rust/90 text-white border-2 border-navy py-2.5 px-4 rounded-xl font-grotesk font-bold text-sm shadow-pop-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    <UserPlus size={16} />
                    <span>Get Started Free</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
