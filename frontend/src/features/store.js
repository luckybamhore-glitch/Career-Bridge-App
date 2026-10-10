import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth/authSlice"
import counselor from "./counselor/counselor"
import admin from "./admin/adminSlice"
const store = configureStore({
    reducer: { auth , counselor , admin }
})


export default store