import mongoose from "mongoose";


const careerSchema = new mongoose.Schema({
category :{
    type : mongoose.Schema.Types.ObjectId ,
   ref : "Category" ,
   required : true
} ,
title :{
     type :String ,
     required : [true , "Please Enter Title"]
} ,
description :{
    type : String ,
    required : [true , "Please Enter Description"] 
} ,
requiredQualification :{
 type : String ,
required : [true , "Please Enter Required Qualification"] 
} ,
duration :{
     type : String ,
    required : [true , "Please Enter Duration"] 
} ,
salary :{
     type : String ,
    required : [true , "Please Enter Salary"] 
}
 
},
{
    timestamps:true
})


const Career = mongoose.model("Career" , careerSchema)

export default Career
