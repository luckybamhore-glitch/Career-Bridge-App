import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import adminService from '../services/adminService';
import toast from 'react-hot-toast';
import LoadingScreen from '../components/LoadingScreen';
import { useEffect } from 'react';
import { setAdminData } from '../features/admin/adminSlice';
import UpdateUserButton from '../components/UpdateUserButton';

export default function AdminUsers() {
  const dispatch = useDispatch()

  const { user } = useSelector(state => state.auth)
  const { users } = useSelector(state => state.admin)

  const { data, isLoading, isSuccess, isError, error } = useQuery({ queryKey: ["admin"], queryFn: () => adminService.fetchAdminOverview(user.token) })


  


  useEffect(() => {

    if (isSuccess) {
      dispatch(setAdminData(data))
    }

    if (isError) {
      toast.error(error?.response?.data?.message, { position: "top-center" })
    }

  }, [isSuccess, isError, error, data])


  if (isLoading || !users) {
    return (
      <LoadingScreen loadingMessage='Fetching All Data...' />
    )
  }



  return (
    <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
      <Navbar activePage="admin" />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeTab="admin_users" role="admin" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-grid-pattern w-full min-w-0 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-block bg-yellow border-3 border-navy px-3 py-1 rounded-full shadow-pop-sm font-mono text-xs font-bold text-navy mb-2">
              USER MANAGEMENT
            </div>
            <h1 className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy">
              User Directory & <span className="text-rust">Permissions</span>
            </h1>
            <p className="font-body text-sm text-navy-muted mt-1">
              Search, filter, inspect, and manage active student and counselor accounts across India.
            </p>
          </div>

          {/* Users Table */}
          <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-xs">
                <thead>
                  <tr className="border-b-3 border-navy font-grotesk font-extrabold text-navy uppercase text-[11px] bg-parchment-dim">
                    <th className="p-3">User Profile</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Wallet Credits</th>
                    <th className="p-3">Joined Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-navy/10 font-mono">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-parchment/60">
                      <td className="p-3">
                        <div className="font-bold text-navy">{u.name}</div>
                        <div className="text-[10px] text-navy-muted">{u.email}</div>
                      </td>
                      <td className="p-3 font-bold text-navy">{u.userType}</td>
                      <td className="p-3 font-bold text-rust">{u.credits}</td>
                      <td className="p-3 text-navy-muted">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="p-3">
                        <StatusBadge text={u.isActive ? "Active" : "Suspended"} status="success" />
                      </td>
                      <td className="p-3 text-right space-x-2">
                       <UpdateUserButton u  ={u} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}