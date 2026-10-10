import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { useQuery } from '@tanstack/react-query';
import adminService from '../services/adminService';
import LoadingScreen from '../components/LoadingScreen';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setAdminData } from '../features/admin/adminSlice';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';


export default function AdminOverview() {

const dispatch = useDispatch()



const {user} = useSelector(state => state.auth)


const {data , isError , error,  isLoading , isSuccess} = useQuery({queryKey : ["admin"] , queryFn: ()=> adminService.fetchAdminOverview(user.token), refetchInterval: 5000, refetchOnWindowFocus: true} )

const isWithin2Hours = (date) => date && (Date.now() - new Date(date).getTime() < 24 * 60 * 60 * 1000)
const pendingApprovals = data?.counselors?.filter(item => item.status === "pending" || (item.status === "rejected" && isWithin2Hours(item.updatedAt || item.createdAt))) ?? []
const pendingCredits = data?.credits?.filter(item => item.status === "pending" || (item.status === "rejected" && isWithin2Hours(item.updatedAt || item.createdAt))) ?? []
const activeCounselors = data?.counselors?.filter(item => item.status === "accepted").length
const grantedCredits = data?.credits?.filter(item => item.status === "granted").reduce((acc, item) => acc + item.credits  ,0)
const newUsers48h = data?.users?.filter(item => new Date(item?.createdAt) >= new Date(Date.now() - 48 * 60 * 60 * 1000))?.length ?? 0



  useEffect(() => {

  if(isSuccess){
     dispatch(setAdminData(data))
  }
if(isError){
  toast.error(error?.response?.data?.message )
}

  },[isError , isSuccess , error , data ])
  



  if(isLoading){
  return(
    <LoadingScreen loadingMessage='Fetching All Data...'/>
  )
  }
  

  return (
    <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
      <Navbar activePage="admin" />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeTab="admin_overview" role="admin" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-grid-pattern w-full min-w-0 overflow-y-auto">
          {/* Header */}
          <div className="bg-navy text-white border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="inline-block bg-yellow text-navy font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-2">
                  ADMIN SUPERVISOR SUITE
                </div>
                <h1 className="font-grotesk font-extrabold text-2xl sm:text-3xl text-white">
                  CareerBridge <span className="text-yellow">Platform Control</span>
                </h1>
                <p className="font-body text-xs text-parchment-dim mt-1">
                  Global system metrics, user growth analytics, counselor approvals, and credit circulation monitoring.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button variant="primary" size="md">
                  System Health Report 📊
                </Button>
              </div>
            </div>
          </div>

          {/* Metrics Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card color="white">
              <div className="font-mono text-xs font-bold text-navy-muted uppercase">Total Registered Users</div>
              <div className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy mt-2">{data?.users?.length}</div>
              <div className="text-xs text-rust font-bold mt-1">+{newUsers48h} students in last 48 hours</div>
            </Card>

            <Card color="white">
              <div className="font-mono text-xs font-bold text-navy-muted uppercase">Active Counselors</div>
              <div className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy mt-2">{activeCounselors}</div>
              <div className="text-xs text-teal font-bold mt-1">{pendingApprovals.length} Pending Applications</div>
            </Card>

            <Card color="white">
              <div className="font-mono text-xs font-bold text-navy-muted uppercase">Credits Circulating</div>
              <div className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy mt-2">{grantedCredits}</div>
              <div className="text-xs text-rust font-bold mt-1">₹4.2L Monthly Credit Revenue</div>
            </Card>

            <Card color="yellow">
              <div className="font-mono text-xs font-bold text-navy uppercase">AI Roadmaps Generated</div>
              <div className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy mt-2"> {data?.roadmaps?.length} </div>
              <div className="text-xs text-navy font-bold mt-1">99.8% System Uptime</div>
            </Card>
          </div>

          {/* Activity Log & Pending Actions */}
         
       
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop">
                <h2 className="font-grotesk font-extrabold text-xl text-navy mb-4">Pending Counselor Requests</h2>
                <Link to={"/auth/admin/approvals"}>
                
               <div className="space-y-3 font-mono text-xs">
                  {pendingApprovals.map((request) => (
                  
                    <div key={request._id} className="bg-parchment border-2 border-navy p-3 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <div>
                        <span className="font-bold text-rust">[{new Date(request?.createdAt).toLocaleDateString("en-In")}]</span>{' '}
                        <span className="font-bold text-navy">{request?.user?.name}</span>
                        <div className="text-black  font-bold text-[14px] mt-0.5">{request?.category?.title}</div>
                      </div>
                      <StatusBadge text= {request?.status}status="warning" />
                    </div>

                  ))}
                </div>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop">
                <h2 className="font-grotesk font-extrabold text-xl text-navy mb-4">Pending Credit Requests</h2>
                <Link to={"/auth/admin/credits_requests"}>
                
                <div className="space-y-3 font-mono text-xs">
                  {pendingCredits?.map((request) => (
                  
                    <div key={request._id} className="bg-parchment border-2 border-navy p-3 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <div>
                        <span className="font-bold text-rust">[{new Date(request?.createdAt).toLocaleDateString("en-In")}]</span>{' '}
                        <span className="font-bold text-navy">{request?.user?.name}</span>
                        <div className="text-black  font-bold text-[14px] mt-0.5">{request?.credits} credits</div>
                      </div>
                      <StatusBadge text= {request?.status}status="warning" />
                    </div>

                  ))}
                </div>
                </Link>
              </div>
            </div>

      
          </div>

        
        </main>
      </div>
    </div>
  );
}
 