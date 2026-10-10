import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import LoadingScreen from '../components/LoadingScreen';
import creditService from '../services/creditService';
import dashboardService from '../services/dashboardService';
import { updateCredits } from '../features/auth/authSlice';

export default function MyCredits() {

  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [customAmount, setCustomAmount] = useState('');

  const packs = [
    { name: 'Starter Pack', credits: 100, price: '₹299', perCredit: '₹2.99 / credit', popular: false, badge: 'STARTER' },
    { name: 'Student Value Pack', credits: 300, price: '₹699', perCredit: '₹2.33 / credit', popular: true, badge: 'MOST POPULAR 🔥' },
    { name: 'Pro Career Pack', credits: 700, price: '₹1,299', perCredit: '₹1.85 / credit', popular: false, badge: 'BEST VALUE' },
  ];

  const { data: history, isLoading } = useQuery({
    queryKey: ['creditHistory'],
    queryFn: () => creditService.fetchHistory(user.token),
    enabled: !!user?.token,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });

  // Fresh wallet balance — redux `user.credits` goes stale after admin grants
  const { data: dashboard } = useQuery({
    queryKey: ['user-dashboard'],
    queryFn: () => dashboardService.getUserDashboard(user.token),
    enabled: !!user?.token,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });

  useEffect(() => {
    const fresh = dashboard?.profile?.credits ?? dashboard?.stats?.creditBalance;
    if (typeof fresh === 'number' && fresh !== user?.credits) {
      dispatch(updateCredits(fresh));
    }
  }, [dashboard, dispatch, user?.credits]);

  const walletBalance = dashboard?.profile?.credits ?? user?.credits ?? 0;

  const { mutate, isPending, isSuccess, isError, error, data } = useMutation({
    mutationFn: (credits) => creditService.requestCredits({ token: user.token, credits }),
  });

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(`Request for ${data.credits} credits sent for approval`);
      queryClient.invalidateQueries({ queryKey: ['creditHistory'] });
      setCustomAmount('');
    }
    if (isError && error) {
      toast.error(error?.response?.data?.message || error?.message || 'Request failed');
    }
  }, [isSuccess, data, isError, error]);

  const handlePackRequest = (amount) => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid credit amount');
      return;
    }
    mutate(Number(amount));
  };

  const transactions = Array.isArray(history) ? history : [];

  if (isLoading) return <LoadingScreen loadingMessage="Loading wallet..." />;

  return (
    <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
      <Navbar activePage="credits" />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeTab="credits" role="student" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-grid-pattern w-full min-w-0 overflow-y-auto">
          {/* Header & Balance Banner */}
          <div className="bg-yellow border-4 border-navy rounded-3xl p-4 sm:p-6 lg:p-8 shadow-pop mb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="inline-block bg-navy text-yellow font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-2">
                  WALLET & CREDITS
                </div>
                <h1 className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy">
                  Manage CareerBridge Credits
                </h1>
                <p className="font-body text-sm text-navy-muted mt-1">
                  Request credits, track approvals, and spend them on AI roadmaps and mentorship calls.
                </p>
              </div>

              <div className="bg-parchment-card border-3 border-navy p-6 rounded-2xl shadow-pop text-center min-w-0 w-full sm:w-auto sm:min-w-[220px]">
                <div className="font-mono text-xs font-bold text-navy-muted uppercase">AVAILABLE BALANCE</div>
                <div className="font-grotesk font-extrabold text-2xl sm:text-3xl lg:text-4xl text-rust mt-1">{walletBalance} <span className="text-base text-navy">pts</span></div>
                <StatusBadge text="ACTIVE WALLET" status="success" />
              </div>
            </div>
          </div>

          {/* Request Credits Section */}
          <div className="mb-10">
            <h2 className="font-grotesk font-extrabold text-2xl text-navy mb-2">Request Credit Top-Up</h2>
            <p className="font-body text-xs text-navy-muted mb-6">Pick a pack or enter a custom amount — admin approval adds credits to your wallet.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packs.map((p, idx) => (
                <Card
                  key={idx}
                  color={p.popular ? 'yellow' : 'white'}
                  classNameName={`relative flex flex-col justify-between ${p.popular ? 'border-4 shadow-pop-lg' : ''}`}
                >
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-3">
                      <StatusBadge text={p.badge} status={p.popular ? 'success' : 'info'} />
                      <span className="font-mono text-[10px] font-bold text-navy-muted">{p.perCredit}</span>
                    </div>

                    <h3 className="font-grotesk font-extrabold text-2xl text-navy">{p.name}</h3>
                    <div className="font-grotesk font-extrabold text-2xl sm:text-3xl text-rust mt-2">{p.credits} Credits</div>
                    <div className="font-mono text-xl font-bold text-navy mt-1">{p.price} <span className="text-xs text-navy-muted">inclusive GST</span></div>
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-navy/20">
                    <Button variant={p.popular ? 'accent' : 'primary'} size="md" classNameName="w-full" clickAction={() => handlePackRequest(p.credits)}>
                      {isPending ? 'Requesting...' : `Request ${p.credits} Credits →`}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Custom amount */}
            <form
              onSubmit={(e) => { e.preventDefault(); handlePackRequest(customAmount); }}
              className="mt-6 bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop flex flex-col md:flex-row items-center gap-4"
            >
              <div className="flex-1 w-full">
                <label className="block font-grotesk font-bold text-xs uppercase text-navy mb-1.5">
                  Custom Credit Amount
                </label>
                <input
                  type="number"
                  min={1}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full bg-parchment border-3 border-navy rounded-xl px-4 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
                />
              </div>
              <div className="md:pt-6">
                <Button variant="accent" size="md" type="submit">
                  {isPending ? 'Requesting...' : 'Send Custom Request →'}
                </Button>
              </div>
            </form>
          </div>

          {/* Transaction History Ledger */}
          <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop">
            <h2 className="font-grotesk font-extrabold text-xl text-navy mb-4">Credit Request Ledger</h2>
            {transactions.length === 0 ? (
              <p className="font-body text-xs text-navy-muted text-center py-6">
                No credit requests yet — request your first top-up above. 🙏
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body text-xs">
                  <thead>
                    <tr className="border-b-3 border-navy font-grotesk font-extrabold text-navy uppercase text-[11px] bg-parchment-dim">
                      <th className="p-3">Credits</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-navy/10">
                    {transactions.map((tx) => (
                      <tr key={tx._id} className="hover:bg-parchment/60 font-mono">
                        <td className="p-3 font-bold text-navy">+{tx.credits} Credits</td>
                        <td className="p-3 text-navy-muted">
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td className="p-3">
                          <StatusBadge
                            text={tx.status?.toUpperCase()}
                            status={tx.status === 'granted' ? 'success' : tx.status === 'rejected' ? 'warning' : 'info'}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
