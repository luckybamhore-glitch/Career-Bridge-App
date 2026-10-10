import { Link } from "react-router-dom";

export default function Sidebar({ activeTab = 'overview', role = 'student', showMobileNav = true }) {
  const studentNav = [
    { id: 'overview', label: 'My Dashboard', link : "/auth/profile", icon: '📊' },
    { id: 'roadmap', label: 'My Roadmaps',  link : "/auth/profile/my-roadmaps", icon: '⚡' },
    { id: 'messages', label: 'Messages & Chat', link : "/auth/profile/chat" , icon: '💬' },
    { id: 'credits', label: 'My Credits & Wallet', link : "/auth/profile/my-credits"   , icon: '🪙' },
    { id: 'become_counselor', label: 'Join as Counselor', link : "/auth/profile/become-counselor" ,  icon: '🎓' },
  ];

  const adminNav = [
    { id: 'admin_overview', label: 'System Overview', link : "/auth/admin" , icon: '🛡️' },
    { id: 'admin_users', label: 'User Directory', link : "/auth/admin/users" , icon: '👥' },
    { id: 'admin_categories', label: 'Categories & Tags', link : "/auth/admin/categories" , icon: '🏷️' },
    { id: 'admin_approvals', label: 'Counselor Approvals', link : "/auth/admin/approvals" , icon: '📝' },
    { id: 'admin_credit_requests', label: 'Credit Requests', link : "/auth/admin/credits_requests" , icon: '💳' },
    { id: 'admin_ai', label: 'AI Prompt Engine', link : "/auth/admin/ai"  , icon: '🤖' },
  ];

  const counselorNav = [
    { id: 'counselor_overview', label: 'My Details', link: '/auth/counselor', icon: '📈' },
    { id: 'counselor_messages', label: 'Student Messages', link: '/auth/counselor/messages', icon: '💬' },
    { id: 'counselor_reviews', label: 'My Reviews', link: '/auth/counselor/reviews', icon: '⭐' },
  ];

  const items = role === 'admin' ? adminNav : role === 'counselor' ? counselorNav : studentNav;

  return (
    <aside className="hidden w-64 lg:w-72 shrink-0 bg-parchment-card border-r-4 border-navy p-4 md:flex flex-col justify-between min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
  
        {/* Navigation Items */}
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.id}
              to  ={item.link}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg border-2 border-navy transition-all font-grotesk font-bold text-sm ${
                activeTab === item.id
                  ? 'bg-yellow text-navy shadow-pop-sm'
                  : 'bg-parchment text-navy hover:bg-parchment-dim'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
