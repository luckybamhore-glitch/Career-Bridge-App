
import StatusBadge from '../components/StatusBadge';
import { Header } from '../components/Header';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const { user } = useSelector((state) => state.auth);

  const getProfilePath = () => {
    if (user?.userType === 'ADMIN') return '/auth/admin';
    if (user?.userType === 'COUNSELOR') return '/auth/counselor';
    return '/auth/profile';
  };

  const stats = [
    { number: '500+', label: 'Students Guided Across India', note: 'IITs, NITs & State Universities' },
    { number: '80+', label: 'Verified Industry Mentors', note: 'Ex-Google, Swiggy, Microsoft' },
    { number: '4.8', label: 'Average Session Rating', note: 'From 400+ mentorship calls' },
    { number: '14.2k', label: 'Active Indian Tech Jobs', note: 'Bengaluru, Gurgaon, Hyderabad' },
  ];

  const steps = [
    {
      phase: 'Step 01',
      title: 'Create Account & Claim 100 Free Credits',
      status: 'START HERE',
      badgeStatus: 'success',
      topics: [
        'Sign up in under 60 seconds using your Google or student email',
        'Receive 100 starter credits instantly added to your wallet',
        'Zero subscription fees or recurring monthly charges',
      ],
      highlight: '🎁 Instant 100 Credits Bonus Granted on Signup',
    },
    {
      phase: 'Step 02',
      title: 'Explore Careers or Book 1-on-1 Mentorship',
      status: 'EXPLORE & CONNECT',
      badgeStatus: 'info',
      topics: [
        'Compare realistic salary ranges across Full-Stack, AI, Data & Govt roles',
        'Book 45-minute video calls with verified mentors (Dr. Ramesh, Ananya Roy)',
        'Get portfolio reviews, resume ATS checks, and mock interview practice',
      ],
      highlight: '🎓 80+ Verified Industry Experts Available in IST Slots',
    },
    {
      phase: 'Step 03',
      title: 'Generate Custom AI Career Roadmap',
      status: 'AI ENGINE V2.4',
      badgeStatus: 'warning',
      topics: [
        'Input your target role, weekly hours, and target salary expectation (INR)',
        'Receive a structured 4-phase learning path customized for Indian placements',
        'Access curated free resources, project ideas, and interview questions',
      ],
      highlight: '⚡ 1 AI Roadmap Generation = 10 Credits',
    },
    {
      phase: 'Step 04',
      title: 'Execute Milestones & Land Your Dream Job',
      status: 'GOAL ACHIEVED',
      badgeStatus: 'purple',
      topics: [
        'Complete milestone projects and track phase progress percentage',
        'Prepare for technical DSA rounds and system design interviews',
        'Receive placement guidance for tier-1 Indian tech startups & MNCs',
      ],
      highlight: '🚀 Average Starting Package Target: ₹8L - ₹18L / year',
    },
  ];

  const featuredCareers = [
    { title: 'Full-Stack Web Engineer', category: 'Software Engineering', salary: '₹6L - ₹18L / yr', openings: '14,200+ Vacancies', badge: 'HIGH DEMAND' },
    { title: 'Dr. Ramesh Kumar', category: 'Ex-Google Staff Engineer', salary: '50 Credits / Call', openings: '4.9 ★ (180+ Reviews)', badge: 'TOP MENTOR' },
    { title: 'Data Analyst & BI Specialist', category: 'Data & Analytics', salary: '₹5L - ₹12L / yr', openings: '9,800+ Vacancies', badge: 'POPULAR' },
    { title: 'Ananya Roy', category: 'Lead Designer @ Swiggy', salary: '40 Credits / Call', openings: '4.8 ★ (120+ Reviews)', badge: 'DESIGN MENTOR' },
  ];

  return (
    <div className="min-h-screen bg-parchment text-navy overflow-x-hidden font-body antialiased selection:bg-yellow selection:text-navy">
      {/* 1. Header / Nav (Solid Navy Band matching StudentDashboard.jsx top bar style) */}
      <Header />
      {/* 2. Hero Section (Parchment canvas with generous whitespace & Space Grotesk Medium title + Trajectory SVG) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 sm:py-16 lg:py-28 relative overflow-hidden">
        {/* Quiet Trajectory Line Background SVG (Moment 1 of visual richness) */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 hidden lg:block">
          <svg width="460" height="240" viewBox="0 0 460 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20 200 C 140 20, 300 220, 440 40" stroke="#0d1a3c" strokeWidth="2" strokeDasharray="5 5" />
            <circle cx="20" cy="200" r="6" fill="#964900" stroke="#0d1a3c" strokeWidth="1.5" />
            <circle cx="170" cy="105" r="5" fill="#00658b" stroke="#0d1a3c" strokeWidth="1.5" />
            <circle cx="440" cy="40" r="7" fill="#ffd84d" stroke="#0d1a3c" strokeWidth="2" />
          </svg>
        </div>

        <div className="max-w-3xl">
          <div className="inline-block bg-yellow text-navy font-mono text-xs font-bold px-3 py-1 rounded-full uppercase mb-4 border border-navy">
            ⚡ INDIA CAREER GUIDANCE PLATFORM 2026
          </div>

          <h1 className="font-grotesk font-medium text-4xl sm:text-5xl lg:text-6xl text-navy tracking-tight leading-tight">
            Find your next stop in your <span className="text-rust">career journey</span>.
          </h1>

          <p className="font-body font-normal text-base sm:text-lg text-navy-muted mt-6 leading-relaxed max-w-2xl">
            Explore verified Indian salary benchmarks, generate custom AI roadmaps, and book 1-on-1 mentorship calls with engineering and product leaders from Google, Swiggy, and Microsoft.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              to={user ? getProfilePath() : "/register"}
              className="bg-rust text-white font-grotesk font-medium text-sm px-7 py-3.5 rounded-full border border-navy hover:bg-rust/90 transition-all inline-block"
            >
              {user ? `Back to ${user.name} Profile →` : `Get started free (100 Credits) →`}
            </Link>
            <span className="font-mono text-xs text-navy-muted">
              ✓ No credit card required • Instant access
            </span>
          </div>
        </div>
      </section>

      {/* 3. Trust Strip (Space Mono numerals texture matching MyCredits.jsx) */}
      <section className="border-y-2 border-navy/20 bg-parchment-card py-12 px-6  lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((st, idx) => (
              <div key={idx} className="border-2 border-navy p-6 rounded-2xl bg-parchment">
                <div className="font-mono text-xs font-bold text-navy-muted uppercase tracking-wider">{st.label}</div>
                <div className="font-mono font-bold text-2xl sm:text-3xl lg:text-4xl lg:text-5xl text-rust mt-3 tracking-tight">
                  {st.number}
                </div>
                <div className="font-body text-xs text-navy mt-2">{st.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How It Works (Trajectory Arc section visually matching RoadmapResult.jsx closely) */}
      <section id="how-it-works" className="py-20 px-6 lg:px-12 border-b-2 border-navy/20 bg-parchment">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <div className="font-mono text-xs font-bold text-rust uppercase tracking-wider mb-2">GUIDED PROCESS</div>
            <h2 className="font-grotesk font-medium text-2xl sm:text-3xl text-navy">
              How CareerBridge guides your path
            </h2>
            <p className="font-body text-sm text-navy-muted mt-2">
              A structured 4-step framework matching our AI roadmap engine.
            </p>
          </div>

          {/* Timeline Phases matching RoadmapResult.jsx layout & classNamees */}
          <div className="space-y-8 max-w-5xl">
            {steps.map((p, idx) => (
              <div key={idx} className="bg-parchment-card border-2 border-navy rounded-3xl p-6 relative">
                {/* Connecting Line Indicator matching RoadmapResult.jsx */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute left-8 -bottom-9 w-1 h-9 bg-navy"></div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b border-navy/20">
                  <div>
                    <div className="font-mono text-xs font-bold text-rust uppercase tracking-wider">{p.phase}</div>
                    <h3 className="font-grotesk font-medium text-xl text-navy mt-0.5">{p.title}</h3>
                  </div>
                  <StatusBadge text={p.status} status={p.badgeStatus} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-parchment border border-navy p-4 rounded-2xl">
                    <h4 className="font-grotesk font-medium text-xs text-navy uppercase mb-2">Key Steps & Deliverables:</h4>
                    <ul className="space-y-1.5 font-body text-xs text-navy">
                      {p.topics.map((t, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-rust font-bold">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-sky/20 border border-navy p-4 rounded-2xl flex flex-col justify-between">
                    <div>
                      <h4 className="font-grotesk font-medium text-xs text-navy uppercase mb-2">Step Highlight:</h4>
                      <p className="font-grotesk font-medium text-sm text-navy">{p.highlight}</p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-navy/20 flex justify-between items-center">
                      <span className="font-mono text-[10px] font-bold text-navy-muted">Instant Access</span>
                      <button type="button" className="px-3 py-1 bg-yellow border border-navy rounded-full font-grotesk font-medium text-xs text-navy">
                        Explore Step →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. For Students / For Counselors (Teal & Yellow color moments) */}
      <section id="audiences" className="py-20 px-6 lg:px-12 bg-parchment border-b-2 border-navy/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Students Card with Teal accent moment */}
            <div className="bg-teal-container border-2 border-navy rounded-3xl p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <StatusBadge text="FOR STUDENTS" status="info" />
                <h3 className="font-grotesk font-medium text-2xl text-navy mt-4">
                  Clear Direction for College & Placement Success
                </h3>
                <p className="font-body text-sm text-navy mt-3 leading-relaxed">
                  Whether preparing for campus placements, switching from service IT firms to product startups, or targeting civil services, access real Indian salary benchmarks and custom AI roadmaps.
                </p>

                <ul className="mt-6 space-y-2 font-mono text-xs text-navy">
                  <li className="flex items-center space-x-2">
                    <span className="text-rust font-bold">✔</span>
                    <span>100 Free Starter Credits on Signup</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-rust font-bold">✔</span>
                    <span>Step-by-Step 4-Phase AI Learning Tracks</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-rust font-bold">✔</span>
                    <span>Direct 1-on-1 Mentorship Booking</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-navy">
                <Link
                  to={user ? getProfilePath() : "/register"}
                  className="w-full text-center bg-rust text-white font-grotesk font-medium text-sm py-3 rounded-full border border-navy hover:bg-rust/90 transition-all block"
                >
                  {user ? `Go to ${user.name} Dashboard →` : "Create Free Student Account →"}
                </Link>
              </div>
            </div>

            {/* Counselors Card with Yellow highlight moment */}
            <div className="bg-yellow border-2 border-navy rounded-3xl p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <StatusBadge text="FOR MENTORS & EXPERTS" status="success" />
                <h3 className="font-grotesk font-medium text-2xl text-navy mt-4">
                  Share Your Industry Expertise & Earn Payouts
                </h3>
                <p className="font-body text-sm text-navy mt-3 leading-relaxed">
                  Join 80+ top engineering managers, staff developers, and Civil Services officers. Host 1-on-1 resume reviews and mock interviews with flexible IST calendar availability.
                </p>

                <ul className="mt-6 space-y-2 font-mono text-xs text-navy">
                  <li className="flex items-center space-x-2">
                    <span className="text-navy font-bold">✔</span>
                    <span>Set your own credit fee (e.g. 50 Credits / call)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-navy font-bold">✔</span>
                    <span>Guaranteed bank payouts into Indian accounts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-navy font-bold">✔</span>
                    <span>Verified mentor badge & spotlight ranking</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-navy">
                <Link
                  to={user?.userType === 'COUNSELOR' ? "/auth/counselor" : (user ? "/auth/profile/become-counselor" : "/register")}
                  className="w-full text-center bg-navy text-white font-grotesk font-medium text-sm py-3 rounded-full border border-navy hover:bg-navy-light transition-all block"
                >
                  {user?.userType === 'COUNSELOR' ? "Go to Counselor Dashboard →" : "Apply as Counselor Partner →"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured Catalog Preview (Clean row list pattern) */}
      <section id="previews" className="py-20 px-6 lg:px-12 bg-parchment border-b-2 border-navy/20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-parchment-card border-2 border-navy rounded-3xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-navy/20">
              <div>
                <div className="font-mono text-xs font-bold text-rust uppercase tracking-wider mb-1">
                  DIRECTORY PREVIEW
                </div>
                <h2 className="font-grotesk font-medium text-2xl text-navy">Featured Careers & Verified Mentors</h2>
              </div>
              <a href="#" className="font-grotesk font-medium text-xs text-rust hover:underline">
                Explore Full Directory (100+ Roles) →
              </a>
            </div>

            <div className="divide-y divide-navy/20 border-b border-navy/20">
              {featuredCareers.map((item, idx) => (
                <div key={idx} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-navy bg-parchment p-2 rounded border border-navy">
                      0{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-grotesk font-medium text-base text-navy">{item.title}</h4>
                        <StatusBadge text={item.badge} status="success" />
                      </div>
                      <p className="font-mono text-xs text-navy-muted">{item.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="font-mono text-xs font-bold text-rust bg-rust-container px-3 py-1 rounded-full border border-navy">
                      {item.salary}
                    </span>
                    <span className="font-mono text-xs font-bold text-navy bg-parchment-dim px-2.5 py-1 rounded-full border border-navy hidden sm:inline">
                      {item.openings}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Credits & Wallet Explainer (Mustard data accent moment) */}
      <section id="credits" className="py-20 px-6 lg:px-12 bg-parchment border-b-2 border-navy/20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-parchment-card border-2 border-navy rounded-3xl p-4 sm:p-6 lg:p-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="inline-block bg-mustard text-navy font-mono text-xs font-bold px-3 py-1 rounded-full uppercase mb-2">
                  MUSTARD DATA POINT: 1 CREDIT = 1 AI ROADMAP
                </div>
                <h2 className="font-grotesk font-medium text-2xl sm:text-3xl text-navy">
                  How CareerBridge Credits Work
                </h2>
                <p className="font-body text-sm text-navy-muted mt-1 max-w-xl">
                  No monthly subscription traps. Pay only for AI roadmaps generated and 1-on-1 mentorship calls booked.
                </p>
              </div>

              <div className="bg-parchment border-2 border-navy p-6 rounded-2xl text-center min-w-0 w-full sm:w-auto sm:min-w-[220px]">
                <div className="font-mono text-xs font-bold text-navy-muted uppercase">STARTER BALANCE</div>
                <div className="font-mono font-bold text-2xl sm:text-3xl lg:text-4xl text-rust mt-1">100 <span className="text-base font-normal text-navy">pts</span></div>
                <StatusBadge text="FREE ON SIGNUP" status="success" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border-2 border-navy p-6 rounded-2xl bg-parchment-card">
              <StatusBadge text="AI GENERATION" status="info" />
              <h3 className="font-grotesk font-medium text-xl text-navy mt-3">10 Credits / Roadmap</h3>
              <p className="font-body text-xs text-navy-muted mt-2">
                Generates a complete 4-phase learning path tailored to Indian tech market requirements and salary benchmarks.
              </p>
            </div>

            <div className="border-2 border-navy p-6 rounded-2xl bg-parchment-card">
              <StatusBadge text="MENTOR CALL" status="success" />
              <h3 className="font-grotesk font-medium text-xl text-navy mt-3">40 - 60 Credits / Session</h3>
              <p className="font-body text-xs text-navy-muted mt-2">
                45-minute live 1-on-1 video consultation, resume ATS feedback, and mock technical interview practice.
              </p>
            </div>

            <div className="border-2 border-navy p-6 rounded-2xl bg-yellow">
              <StatusBadge text="UPI TOP-UP" status="warning" />
              <h3 className="font-grotesk font-medium text-xl text-navy mt-3">Packs from ₹299</h3>
              <p className="font-body text-xs text-navy mt-2">
                Instant credit delivery via UPI, GPay, PhonePe, or Card. Purchased credits never expire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Final CTA Band (Full-width Solid Navy Section with Real Vertical Padding py-20) */}
      <section className="bg-navy text-parchment py-20 px-6 lg:px-12 border-t-2 border-navy relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block bg-yellow text-navy font-mono text-xs font-bold px-3.5 py-1 rounded-full uppercase">
            START YOUR CAREER ROADMAP TODAY
          </div>

          <h2 className="font-grotesk font-medium text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Ready to find your path?
          </h2>

          <p className="font-body text-sm sm:text-base text-parchment-dim max-w-xl mx-auto leading-relaxed">
            Join thousands of Indian students leveraging AI roadmaps and verified industry mentors.
          </p>

          <div className="pt-4 flex justify-center">
            <Link
              to={user ? getProfilePath() : "/register"}
              className="bg-rust text-white font-grotesk font-medium text-sm px-8 py-4 rounded-full border border-navy hover:bg-rust/90 transition-all inline-block"
            >
              {user ? `BACK TO ${user.name.toUpperCase()} PROFILE →` : "CLAIM 100 FREE CREDITS & GET STARTED →"}
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-parchment-card border-t-2 border-navy py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-navy text-white font-grotesk font-medium text-sm flex items-center justify-center">
                  CB
                </div>
                <span className="font-grotesk font-medium text-lg tracking-tight text-navy">
                  CAREER<span className="text-rust">BRIDGE</span>
                </span>
              </div>
              <p className="font-body text-xs text-navy-muted leading-relaxed">
                India's career guidance scaffold for engineering, product, and government job aspirants.
              </p>
            </div>

            <div>
              <div className="font-mono text-xs font-bold text-navy uppercase mb-3">Student Tools</div>
              <ul className="space-y-2 font-body text-xs text-navy-muted">
                <li><a href="#" className="hover:text-rust">Career Explorer</a></li>
                <li><a href="#" className="hover:text-rust">AI Roadmap Generator</a></li>
                <li><a href="#" className="hover:text-rust">Verified Counselors</a></li>
                <li><a href="#" className="hover:text-rust">My Credits Wallet</a></li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-xs font-bold text-navy uppercase mb-3">Programs</div>
              <ul className="space-y-2 font-body text-xs text-navy-muted">
                <li><a href="#" className="hover:text-rust">Join as Counselor Partner</a></li>
                <li><a href="#" className="hover:text-rust">Student Ambassador Program</a></li>
                <li><a href="#" className="hover:text-rust">College Placement Cell Partnership</a></li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-xs font-bold text-navy uppercase mb-3">Legal & Support</div>
              <ul className="space-y-2 font-body text-xs text-navy-muted">
                <li><a href="#" className="hover:text-rust">Terms of Service</a></li>
                <li><a href="#" className="hover:text-rust">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-rust">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-navy/20 pt-6 flex flex-col sm:flex-row justify-between items-center font-mono text-xs text-navy-muted">
            <div>© 2026 CareerBridge India. All rights reserved.</div>
            <div className="mt-2 sm:mt-0 font-bold text-navy">Built for Indian Student Success</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
