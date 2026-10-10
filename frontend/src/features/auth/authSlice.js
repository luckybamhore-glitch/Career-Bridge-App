 
 import { createSlice } from '@reduxjs/toolkit'

 
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const userExist = getStoredUser()


 const initialState = {
 
      user : userExist || null ,
      categories : []
 }
 
  const persistUser = (user) => {
   try {
     if (user) localStorage.setItem("user", JSON.stringify(user));
   } catch {
     // storage full / unavailable — redux state still updates
   }
 };

  const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
    setUser : (state , action)=>{
      persistUser(action.payload);
      return {
        ...state ,
        user: action.payload
      }
    },
    logOutUser :(state , action) => {
      localStorage.removeItem("user");
      return {
        ...state ,
        user : null
      }
    },
    setAllCategories : (state , action) => {
      return {
        ...state ,
       categories : action.payload
      }
    },
    updateCredits: (state, action) => {
      if (state.user) {
        // Accept either a raw number or { credits } / full user payload
        const next =
          typeof action.payload === "number"
            ? action.payload
            : action.payload?.credits ?? action.payload?.creditBalance ?? state.user.credits;
        state.user.credits = next;
        persistUser(state.user);
      }
    }

   }
 });
 
 export const {setUser , logOutUser , setAllCategories  , updateCredits} = authSlice.actions
 
 export default authSlice.reducer
