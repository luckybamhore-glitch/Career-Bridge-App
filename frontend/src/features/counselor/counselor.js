import { createSlice } from '@reduxjs/toolkit'


const initialState = {

    counselors : null
}

const counselor = createSlice({
  name: "counselor",
  initialState,
  reducers: {
    setCounselor : (state ,action)=> {
     return {
      ...state ,
     counselors : action.payload
     }
    }
  }
});

export const {setCounselor} = counselor.actions

export default counselor.reducer