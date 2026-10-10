import React, { useEffect, useState } from 'react'
import Card from './Card'
import Button from './Button'
import { useMutation } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import adminService from '../services/adminService'
import { setCategories, updateCategoryInList } from '../features/admin/adminSlice'
import toast from 'react-hot-toast'

const CategoryForm = ({ handleShowForm, editingCategory = null }) => {

const isEditMode = Boolean(editingCategory?._id)
const [title , setTitle] = useState(editingCategory?.title || "")

const dispatch = useDispatch()

const {mutate : createMutate , data : createData , isSuccess : isCreateSuccess , isPending : isCreatePending , isError : isCreateError , error : createError} = useMutation({mutationFn : (credentials)=> adminService.addCategory(credentials)})
const {mutate : updateMutate , data : updateData , isSuccess : isUpdateSuccess , isPending : isUpdatePending , isError : isUpdateError , error : updateError} = useMutation({mutationFn : (credentials)=> adminService.updateCategory(credentials)})

const {user} = useSelector(state => state.auth)

const handleSubmit = (e) => {
  e.preventDefault()

  const cleanTitle = title.trim()
  if (!cleanTitle) {
    toast.error("Please enter a category title")
    return
  }

  if (isEditMode) {
    updateMutate({
      token : user.token ,
      cid : editingCategory._id ,
      title : cleanTitle
    })
  } else {
    createMutate({
      token : user.token ,
      title : cleanTitle
    })
  }
}


    useEffect(() => {

        if (isCreateSuccess && createData) {
            dispatch(setCategories(createData))
            toast.success("Category added")
            handleShowForm()
        }

        if (isCreateError && createError) {
           toast.error(
    createError?.response?.data?.message ||
    createError?.message ||
    "Something went wrong"
)
        }

    }, [ isCreateSuccess , isCreateError , createError , createData ])

    useEffect(() => {

        if (isUpdateSuccess && updateData) {
            dispatch(updateCategoryInList(updateData))
            toast.success("Category updated")
            handleShowForm()
        }

        if (isUpdateError && updateError) {
           toast.error(
    updateError?.response?.data?.message ||
    updateError?.message ||
    "Something went wrong"
)
        }

    }, [ isUpdateSuccess , isUpdateError , updateError , updateData ])

    const isPending = isCreatePending || isUpdatePending

  return (

      <Card  color="white">
                    <form onSubmit={handleSubmit}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                     <input value={title} onChange={(e)=> setTitle(e.target.value)} className='w-full p-2' type="text" placeholder='Enter Category' />

                    </div>
                    <div className="pt-4 border-t-2 border-navy/20 flex flex-col sm:flex-row gap-2 sm:gap-0 sm:space-x-2">
                      <Button type='submit' variant="primary" size="sm" classNameName="flex-1">
                        {isPending ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update" : "Add")}
                      </Button>
                        <Button clickAction={handleShowForm} variant="accent" size="sm" classNameName="flex-1">
                        Cancel
                      </Button>
                    </div>
                    </form>
                  </Card>
    )
}

export default CategoryForm


