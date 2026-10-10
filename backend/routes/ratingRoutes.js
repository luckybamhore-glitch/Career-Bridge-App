import express from "express"
import protect from "../middleware/authMiddleware.js"
import ratingControllers from "../controllers/ratingControllers.js"


const router = express.Router()


router.post("/:cind"   , protect.forUser , ratingControllers.addRating)
router.get("/:cnid" , protect.forUser , ratingControllers.getRating)



export default  router