  import React, { useEffect } from 'react'
  import StatusBadge from './StatusBadge'
  import { useDispatch, useSelector } from 'react-redux'
  import { useMutation, useQueryClient } from '@tanstack/react-query'
  import adminService from '../services/adminService'
  import toast from 'react-hot-toast'
  import { setCreditsApprovals } from '../features/admin/adminSlice'

  const CreditsApprovals = ({r}) => {

  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { user} = useSelector(state => state.auth)

  const {mutate , data , isPending , isSuccess , isError , error}  = useMutation({mutationFn: (credentials)=> adminService.UpdateCredits(credentials)})

  const handleUpdateCredits = (status , id) => {
      mutate({
          token : user.token ,
          status :status , 
          rid : id
      })
  }


  useEffect(() => {


      if (isSuccess && data) {
          dispatch(setCreditsApprovals(data))
          queryClient.invalidateQueries({ queryKey: ["admin"] });
          toast.success(
            data.status === "granted"
              ? `Granted ${data.credits} credits to ${data?.user?.name || "user"}`
              : `Request ${data.status}`
          );
      }
      if (isError && error) {
              toast.error(
                  error?.response?.data?.message ||
                  error?.message ||
                  "Something went wrong"
              );
          }
  }, [data , isError ,error , isSuccess ])


    return (
    <div  className = {r.status === "rejected" ?"bg-gray-200 border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop flex flex-col md:flex-row justify-between items-start md:items-center gap-4" : "bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 shadow-pop flex flex-col md:flex-row justify-between items-start md:items-center gap-4"} >
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-grotesk font-extrabold text-lg text-navy">{r?.user?.name}</h3>
                      <StatusBadge text={r.credits} status="success" />
                    </div>
                    <p className="font-mono text-xs text-navy-muted">{r?.user?.location} • {new  Date(r?.createdAt).toLocaleDateString("en-IN")}</p>
                   
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:space-x-3 w-full md:w-auto">
                   {
                    r.status === "pending" && (
                      <button  onClick={()=> handleUpdateCredits("rejected" , r._id)}  type="button" className="px-4 py-2 bg-white hover:bg-gray-100 border-2 border-navy rounded-xl font-grotesk font-extrabold text-xs text-navy shadow-pop-sm">
                      Decline
                    </button>
                    )
                   }
                    <button  onClick={()=> handleUpdateCredits("granted" , r._id)}  type="button" className="px-4 py-2 bg-yellow hover:bg-yellow-fixed border-2 border-navy rounded-xl font-grotesk font-extrabold text-xs text-navy shadow-pop-sm">
                      Grant {r.credits} ✓
                    </button>
                  </div>
                </div>
    )
  }

  export default CreditsApprovals
