import axios from "axios"
import counselorServices from "./counselorService"


const loginUserFetch = async(credentials) => {

const response = await axios.post("/api/auth/login" , credentials)
localStorage.setItem("user" , JSON.stringify(response.data))
return response.data

}


// Kept for backward compat — delegates to counselorService (single source of truth)
const fetchQueries = async() => {
  return counselorServices.fetchCategories()
}

// Kept for backward compat — delegates to counselorService (strips token from body)
const becomeCounselor = async(payload) => {
  return counselorServices.becomeCounselor(payload)
}




const registerUserFetch = async(formData) => {

const response = await axios.post("/api/auth/register" , formData , {
  headers : { "Content-Type" : "multipart/form-data" }
})
localStorage.setItem("user" , JSON.stringify(response.data))
return response.data

}


const authServices = { loginUserFetch , registerUserFetch , fetchQueries , becomeCounselor}
export default authServices
