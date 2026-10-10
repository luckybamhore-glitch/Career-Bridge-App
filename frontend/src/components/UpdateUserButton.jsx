
import { useMutation } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import authServices from '../services/authService'
import adminService from '../services/adminService'
import { useDispatch, useSelector } from 'react-redux'
import { setUpdateUser } from '../features/admin/adminSlice'
import toast from 'react-hot-toast'

const updateUserButton = ({u}) => {

const dispatch = useDispatch()
const { user} = useSelector(state => state.auth)
  const {mutate , data , isError ,error, isPending , isSuccess} = useMutation({mutationFn : (credentials  ) => adminService.updateUser(credentials)})

 
const handlerUpdateUser = (id) => {

mutate( {
  uid : id ,
  token : user.token
 })

}

useEffect(() =>{

  if (isSuccess) {
    dispatch(setUpdateUser(data))
   
  }
  if (isError && error) {
    toast.error(error)
    
  }
},[data , isError , isSuccess , error])


  return (
     <button onClick={() =>handlerUpdateUser(u._id) }  type="button" className = {u.isActive ? "px-2.5 py-1.5 bg-rust text-white border border-navy rounded font-mono text-[10px] font-bold" : "px-2 py-1 bg-green-500 text-white border border-navy rounded font-mono text-[10px] font-bold"}>
                          {u.isActive ? "Suspend" : "Activate"}
                        </button>
  )
}

export default updateUserButton