import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';

export default function CareerExplorer() {
  const careers = [
    {
      id: 'c-1',
      title: 'Full-Stack Web Engineer',
      category: 'Software Engineering',
      salary: '₹6L - ₹18L / year',
      demand: 'High Growth 🔥',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Tailwind', 'Docker'],
      description: 'Build end-to-end web applications for top Indian tech startups and MNCs.',
      openings: '14,200+ Openings',
      badge: 'TOP CHOICE',
    },
    {
      id: 'c-2',
      title: 'Data Analyst & BI Specialist',
      category: 'Data & Analytics',
      salary: '₹5L - ₹12L / year',
      demand: 'Very High 📈',
      skills: ['SQL', 'Python', 'PowerBI', 'Excel', 'Tableau'],
      description: 'Transform raw business metrics into actionable growth dashboards.',
      openings: '9,800+ Openings',
      badge: 'POPULAR',
    },
    {
      id: 'c-3',
      title: 'UI/UX Product Designer',
      category: 'Design & Product',
      salary: '₹5L - ₹14L / year',
      demand: 'High Growth 🎨',
      skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping'],
      description: 'Craft intuitive mobile apps and web experiences for millions of Indian users.',
      openings: '4,500+ Openings',
      badge: 'CREATIVE',
    },
    {
      id: 'c-4',
      title: 'UPSC Civil Services Officer',
      category: 'Government & PSU',
      salary: '₹7L - ₹15L + Govt Perks',
      demand: 'Prestigious 🏛️',
      skills: ['General Studies', 'Public Policy', 'Ethics', 'Essay Writing'],
      description: 'Serve the nation in administrative, police, or foreign services.',
      openings: '1,000+ Vacancies/yr',
      badge: 'GOVT ROLE',
    },
    {
      id: 'c-5',
      title: 'Cloud & DevOps Engineer',
      category: 'Infrastructure',
      salary: '₹8L - ₹22L / year',
      demand: 'Booming 🚀',
      skills: ['AWS', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
      description: 'Manage automated deployments and scalable cloud infrastructure on AWS & Azure.',
      openings: '7,300+ Openings',
      badge: 'HIGH SALARY',
    },
    {
      id: 'c-6',
      title: 'Associate Product Manager',
      category: 'Design & Product',
      salary: '₹10L - ₹24L / year',
      demand: 'High Demand 💡',
      skills: ['Roadmapping', 'Agile', 'Data Analytics', 'User Feedback'],
      description: 'Lead cross-functional teams to build impactful products from 0 to 1.',
      openings: '3,200+ Openings',
      badge: 'HOT TRACK',
    },
  ];

  return (
    <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
      <Navbar activePage="explorer" />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeTab="explorer" role="student" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-grid-pattern w-full min-w-0 overflow-y-auto">
          {/* Header Banner */}
          <div className="mb-8">
            <div className="inline-block bg-yellow border-3 border-navy px-3 py-1 rounded-full shadow-pop-sm font-mono text-xs font-bold text-navy mb-2">
              CAREER DIRECTORY 2026
            </div>
            <h1 className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy">
              Explore High-Growth <span className="text-rust">Careers in India</span>
            </h1>
            <p className="font-body text-sm text-navy-muted mt-1">
              Compare salary benchmarks, required skills, and market demand for Indian graduates.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block font-grotesk font-bold text-xs uppercase text-navy mb-1">
                  Search Career Title or Skill
                </label>
                <input
                  type="text"
                  defaultValue="Full-Stack Engineer"
                  placeholder="Search by title (e.g., Python, IAS, Design)..."
                  className="w-full bg-parchment border-3 border-navy rounded-xl px-4 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-grotesk font-bold text-xs uppercase text-navy mb-1">
                  Industry Field
                </label>
                <select className="w-full bg-parchment border-3 border-navy rounded-xl px-3 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none">
                  <option>All Domains</option>
                  <option>Software & IT</option>
                  <option>Data & AI</option>
                  <option>Government & Public Sector</option>
                  <option>Design & Product</option>
                </select>
              </div>

              <div>
                <label className="block font-grotesk font-bold text-xs uppercase text-navy mb-1">
                  Expected Salary
                </label>
                <select className="w-full bg-parchment border-3 border-navy rounded-xl px-3 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none">
                  <option>Any Salary Range</option>
                  <option>₹4L - ₹8L / year</option>
                  <option>₹8L - ₹15L / year</option>
                  <option>₹15L+ / year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Careers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers.map((career) => (
              <Card key={career.id} color="white" classNameName="flex flex-col justify-between hover:translate-y-[-2px] transition-all">
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <StatusBadge text={career.badge} status="success" />
                    <span className="font-mono text-[11px] font-bold text-navy-muted bg-parchment-dim px-2 py-0.5 rounded border border-navy">
                      {career.openings}
                    </span>
                  </div>

                  <h3 className="font-grotesk font-extrabold text-xl text-navy mb-1">{career.title}</h3>
                  <p className="font-mono text-xs font-bold text-rust mb-3">{career.category}</p>

                  <div className="bg-yellow/30 border-2 border-navy p-2.5 rounded-xl mb-4">
                    <div className="font-mono text-[10px] font-bold text-navy-muted uppercase">Avg. Starting Package</div>
                    <div className="font-grotesk font-extrabold text-lg text-navy">{career.salary}</div>
                  </div>

                  <p className="font-body text-xs text-navy-muted mb-4">{career.description}</p>

                  <div className="mb-4">
                    <div className="font-grotesk font-bold text-xs text-navy mb-2">Required Core Skills:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {career.skills.map((sk, idx) => (
                        <span key={idx} className="bg-parchment border border-navy text-navy font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-navy/20 flex flex-col sm:flex-row gap-2 sm:gap-0 sm:space-x-2">
                  <Button variant="outline" size="sm" classNameName="flex-1">
                    View Detail
                  </Button>
                  <Button variant="primary" size="sm" classNameName="flex-1">
                    Build Roadmap →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
