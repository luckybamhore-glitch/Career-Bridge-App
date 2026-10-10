import Rating from "../models/ratingModel.js"


const addRating = async(req, res) => {
   
   let userId = req.user.id
  
let counselorId = req.params.cind

const {rating , review} = req.body 

if(!rating || !review){
    res.status(409)
    throw new Error("Please Enter All Details..!");
    
}

let ratingExist = await Rating.findOne({user : userId})
if(ratingExist){
    res.status(409)
    throw new Error("User All Ready Rated");
    
}


let newRating = new Rating({
    user :userId , 
    counselor : counselorId  ,
    rating ,
    review
})

 await newRating.save()
 await (await newRating.populate("user")).populate("counselor")
    
if(!newRating){
    res.status(409)
    throw new Error("Ranting not here");
    
}
res.status(201).json(newRating)

}


const getRating = async(req, res) => {
   

   

    const ratings = await Rating.find(req.params.cind).populate("user").populate("counselor")

    if(!ratings){
        res.status(409)
        throw new Error("rating is not found");
        
    }
    res.status(200).json(ratings)
}



const ratingControllers = {
    addRating ,getRating
}

export default ratingControllers