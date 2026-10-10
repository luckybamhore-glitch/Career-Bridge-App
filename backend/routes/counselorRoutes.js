import express from "express"
import counselorControllers from "../controllers/counselorControllers.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/counselor" , protect.forUser, counselorControllers.becomeACounselor)
router.get("/counselor" , counselorControllers.getActiveCounselors)
router.get("/counselor/categories" , counselorControllers.getCategories)


export default router