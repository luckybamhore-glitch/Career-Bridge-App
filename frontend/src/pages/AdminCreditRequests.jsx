import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { data } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import adminService from '../services/adminService';
import toast from 'react-hot-toast';
import { setAdminData } from '../features/admin/adminSlice';
import LoadingScreen from '../components/LoadingScreen';
import CreditsApprovals from '../components/CreditsApprovals';

export default function AdminCreditRequests() {


  const dispatch = useDispatch()
const { user} = useSelector(state => state.auth)

const {credits} = useSelector(state => state.admin)

const {data , isSuccess , isLoading , isError ,error} = useQuery({queryKey :["admin"] , queryFn : ()=> adminService.fetchAdminOverview(user.token)})
 const isWithin2Hours = (date) => date && (Date.now() - new Date(date).getTime() < 24 * 60 * 60 * 1000)
 const pendingRequests = credits?.filter(item => item.status === "pending" || (item.status === "rejected" && isWithin2Hours(item.updatedAt || item.createdAt)))

 useEffect (() => {
  if(isSuccess){
    dispatch(setAdminData(data))
  }
  if(isError){
    toast.error(error , {position : "top-center"})
  }
 } ,[data , isError , isSuccess ])

if (isLoading) {
  return (
    <LoadingScreen loadingMessage='Fetching All Data' />
  )
  
}

  return (
    <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
      <Navbar activePage="admin" />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeTab="admin_credit_requests" role="admin" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-grid-pattern w-full min-w-0 overflow-y-auto">
          <div className="mb-8">
            <div className="inline-block bg-yellow border-3 border-navy px-3 py-1 rounded-full shadow-pop-sm font-mono text-xs font-bold text-navy mb-2">
              CREDIT AUDIT
            </div>
            <h1 className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy">
              Manual Credit <span className="text-rust">Requests & Grants</span>
            </h1>
            <p className="font-body text-sm text-navy-muted mt-1">
              Approve student hardship grant requests or manual bank transfer credit additions.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl">
            {pendingRequests?.map((r) => (
             <CreditsApprovals key={r._id} r={r}/>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
