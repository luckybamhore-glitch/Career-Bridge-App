
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
 users : null , 
 careers : null , 
 categories : null ,
 counselors : null ,
 credits : null , 
 roadmaps : null ,
  messages : []
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminData : (state , action) => {
        return {
            ...state ,
            ...action.payload
        }
    },
      setUpdateUser : (state , action) => {
   return {
    ...state ,
    users : state.users.map(user=> user._id === action.payload._id ? action.payload : user)
   }
  },
  setCategories :(state , action) => {
    return {
      ...state ,
      categories : [action.payload , ...(state.categories || [])]
    }
  } ,
  updateCategoryInList :(state , action) => {
    if (!state.categories) return state;
    return {
      ...state ,
      categories : state.categories.map(cat => cat._id === action.payload._id ? action.payload : cat)
    }
  } ,
  removeCategoryFromList :(state , action) => {
    if (!state.categories) return state;
    const deletedId = action.payload?._id || action.payload;
    return {
      ...state ,
      categories : state.categories.filter(cat => cat._id !== deletedId)
    }
  } ,
  setMessage : (state , action) => {
    return {
      ...state ,
      messages : [...state.messages , action.payload]
    }
  } ,
   setApprovals : (state , action) => {
    return {
      ...state ,
      counselors : state.counselors.map(counselor => counselor._id === action.payload._id ? action.payload : counselor)
    }
  },
  setCreditsApprovals : (state , action) => {
    return {
      ...state ,
      credits : state.credits.map(credit => credit._id === action.payload._id ? action.payload : credit)
    }
  }

  } ,



});

export const {setAdminData , setUpdateUser , setCategories , updateCategoryInList , removeCategoryFromList , setMessage  , setApprovals , setCreditsApprovals } = adminSlice.actions

export default adminSlice.reducer