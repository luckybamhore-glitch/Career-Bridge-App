import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import roadmapService from '../services/roadmapService';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import LoadingScreen from '../components/LoadingScreen';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function RoadmapResult() {


  const {user} = useSelector(state => state.auth)
  const printRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);

  const {data , isLoading ,isSuccess , isError ,error}  = useQuery({queryKey:["roadmap"] , queryFn: ()=> roadmapService.getAllRoadmap(user.token), enabled: !!user?.token})

  const roadmaps = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const selected = useMemo(
    () => roadmaps.find((r) => r._id === selectedId) || roadmaps[roadmaps.length - 1] || null,
    [roadmaps, selectedId]
  );

  const generatedOn = selected?.createdAt
    ? new Date(selected.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
    : '—';

  const handleExportPDF = () => {
    if (!selected) {
      toast.error('No roadmap to export yet');
      return;
    }
    // Browser print dialog -> user picks "Save as PDF". Only #print-area is printed via CSS below.
    window.print();
  };

  const handleAddToGoals = () => {
    if (!selected) {
      toast.error('No roadmap to save yet');
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem('activeGoals') || '[]');
      if (!saved.find((g) => g._id === selected._id)) {
        saved.push({ _id: selected._id, text: selected.text?.slice(0, 120), createdAt: selected.createdAt });
        localStorage.setItem('activeGoals', JSON.stringify(saved));
      }
      toast.success('Added to Active Goals');
    } catch {
      toast.success('Added to Active Goals');
    }
  };
 




  const phases = [
    // {
    //   phase: 'Phase 1 (Month 1-2)',
    //   title: 'Frontend Foundations & Modern React',
    //   status: 'COMPLETED (100%)',
    //   badgeStatus: 'success',
    //   topics: [
    //     'HTML5 Semantic Markup & Accessibility',
    //     'CSS Grid, Flexbox & Tailwind CSS Utility Styling',
    //     'ES6+ JavaScript (Promises, Async/Await, Array Methods)',
    //     'React 18 Component Architecture & Hooks',
    //   ],
    //   project: 'Build a Responsive Portfolio & E-commerce Product Showcase UI',
    // },
    // {
    //   phase: 'Phase 2 (Month 3-4)',
    //   title: 'Node.js Backend, REST APIs & Databases',
    //   status: 'IN PROGRESS (65%)',
    //   badgeStatus: 'info',
    //   topics: [
    //     'Node.js Runtime & Express Server Setup',
    //     'RESTful API Design & Middleware Authentication',
    //     'PostgreSQL & MongoDB Database Schemas',
    //     'JWT Tokens, Password Hashing & Security',
    //   ],
    //   project: 'Build a Full-Stack Career Guidance Portal with User Auth',
    // },
    // {
    //   phase: 'Phase 3 (Month 5)',
    //   title: 'Full-Stack Integration & Next.js SSR',
    //   status: 'UPCOMING',
    //   badgeStatus: 'warning',
    //   topics: [
    //     'Next.js App Router, Server Components & SSR',
    //     'Vercel & Render Deployment Pipelines',
    //     'State Management with Zustand & React Query',
    //     'Docker Container Basics',
    //   ],
    //   project: 'Deploy a Production-Ready SaaS Application',
    // },
    // {
    //   phase: 'Phase 4 (Month 6)',
    //   title: 'Interview Prep & Campus Placements',
    //   status: 'LOCKED',
    //   badgeStatus: 'purple',
    //   topics: [
    //     'Top 50 LeetCode Medium DSA Questions in JS',
    //     'System Design Fundamentals (Load Balancers, DB Indexing)',
    //     'Mock Interviews with Verified Counselors',
    //     'Resume ATS Optimization & LinkedIn Networking',
    //   ],
    //   project: 'Land 3+ Interview Offers at Top Indian Product Startups',
    // },
  ];


useEffect(()=> {


 if (isError && error) {
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong"
            );
           
        }

} ,[isError ,error])


if (isLoading) {
  
  return(
    <LoadingScreen loadingMessage='Data is Loading'/>
  )
}

  return (

    <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area {
            position: absolute; left: 0; top: 0; width: 100%;
            border: none !important; box-shadow: none !important;
            padding: 24px; background: #fff; color: #000;
          }
          .no-print { display: none !important; }
        }
      `}</style>
      <Navbar activePage="roadmap" />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeTab="roadmap" role="student" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-grid-pattern w-full min-w-0 overflow-y-auto">
          {/* Header Banner */}
          <div className="bg-yellow border-4 border-navy rounded-3xl p-4 sm:p-6 lg:p-8 shadow-pop mb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <StatusBadge text="AI GENERATED PATH" status="success" />
                  <span className="font-mono text-xs font-bold text-navy-muted">GENERATED ON: {generatedOn}</span>
                </div>
                <h1 className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy">
                   Personalized Career Roadmap
                </h1>
                <p className="font-body text-sm text-navy-muted mt-1">
                  {user?.name ? <>Prepared for <span className="font-bold text-navy">{user.name}</span> • </> : null}
                  {roadmaps.length} roadmap{roadmaps.length === 1 ? '' : 's'} found
                </p>
              </div>

              <div className="flex items-center space-x-3 no-print">
                <Button variant="outline" size="md" clickAction={handleExportPDF}>
                  📥 Export PDF
                </Button>
                <Button variant="accent" size="md" clickAction={handleAddToGoals}>
                  + Add to Active Goals
                </Button>
              </div>
            </div>

          </div>
          {roadmaps.length > 0 && (
            <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop no-print">
                      <h2 className="font-grotesk font-extrabold text-xl text-navy mb-4">Roadmaps Generated ({roadmaps.length})</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-body text-xs">

                          <thead>
                            <tr className="border-b-3 border-navy font-grotesk font-extrabold text-navy uppercase text-[11px] bg-parchment-dim">
                              <th className="p-3">Roadmap Details</th>
                              <th className="p-3">Date</th>
                              <th className="p-3">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y-2 divide-navy/10">
                            {roadmaps.map((item) => (
                              <tr key={item._id} className={`hover:bg-parchment/60 font-mono ${selected?._id === item._id ? 'bg-yellow/20' : ''}`}>
                                <td className="p-3 font-bold text-navy max-w-md truncate">{item.text?.slice(0, 90)}...</td>
                                <td className="p-3 text-navy-muted">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                                <td className="p-3">
                                  <button onClick={() => setSelectedId(item._id)} className="px-3 py-1.5 bg-yellow border-2 border-navy rounded-full font-bold text-[11px]">
                                    {selected?._id === item._id ? 'Viewing' : 'View'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
          )}

          {roadmaps.length === 0 && (
            <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 lg:p-8 shadow-pop text-center my-5 no-print">
              <p className="font-grotesk font-extrabold text-lg text-navy">No roadmaps yet</p>
              <p className="font-body text-xs text-navy-muted mt-1">Generate your first AI roadmap to preview and export it as PDF here.</p>
            </div>
          )}

          {/* Printable roadmap detail */}
          {selected && (
            <div id="print-area" ref={printRef} className="bg-white border-4 border-navy rounded-3xl p-4 sm:p-6 lg:p-8 shadow-pop my-5 max-w-5xl">
              <div className="border-b-2 border-black/10 pb-4 mb-4">
                <h2 className="font-grotesk font-extrabold text-2xl text-navy">Personalized Career Roadmap</h2>
                <p className="font-mono text-[11px] text-navy-muted mt-1">
                  {user?.name || 'Student'} • Generated on {generatedOn} • CareerBridge India
                </p>
              </div>
              <div className="font-body text-sm text-navy leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{selected.text}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Timeline Phases */}
          <div className="space-y-6 my-5 max-w-5xl">
            {phases.map((p, idx) => (
              <div key={idx} className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop relative">
                {/* Connecting Line Indicator */}
                {idx < phases.length - 1 && (
                  <div className="hidden lg:block absolute left-8 -bottom-7 w-1 h-7 bg-navy"></div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b-2 border-navy/20">
                  <div>
                    <div className="font-mono text-xs font-bold text-rust uppercase tracking-wider">{p.phase}</div>
                    <h2 className="font-grotesk font-extrabold text-xl text-navy mt-0.5">{p.title}</h2>
                  </div>
                  <StatusBadge text={p.status} status={p.badgeStatus} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-parchment border-2 border-navy p-4 rounded-2xl">
                    <h3 className="font-grotesk font-bold text-xs text-navy uppercase mb-2">Key Skills & Learning Goals:</h3>
                    <ul className="space-y-1.5 font-body text-xs text-navy">
                      {p.topics.map((t, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-rust font-bold">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-sky/20 border-2 border-navy p-4 rounded-2xl flex flex-col justify-between">
                    <div>
                      <h3 className="font-grotesk font-bold text-xs text-navy uppercase mb-2">Milestone Project:</h3>
                      <p className="font-grotesk font-extrabold text-sm text-navy">🛠️ {p.project}</p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-navy/20 flex justify-between items-center">
                      <span className="font-mono text-[10px] font-bold text-navy-muted">Recommended: 15 hrs/wk</span>
                      <Button variant="primary" size="sm">
                        Mark Phase Done
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
