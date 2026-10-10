import axios from "axios"

const generateRoadmap = async(payload) =>{


    const options = {
    headers :{
        authorization : `Bearer ${payload.token}`
    }
  }
const response = await axios.post("/api/ai/roadmap" , payload , options)
return response.data

}

const getAllRoadmap = async(token)=> {
const options ={
  headers : {
    authorization : `Bearer ${token}`
  }
}

const response = await axios.get("/api/ai/roadmap"  , options)
console.log(response)
// Backend returns { success, count, roadmaps } — unwrap to array for callers
if (Array.isArray(response.data)) return response.data
if (Array.isArray(response.data?.roadmaps)) return response.data.roadmaps
return response.data


}

const roadmapService = {generateRoadmap , getAllRoadmap}

export default roadmapService