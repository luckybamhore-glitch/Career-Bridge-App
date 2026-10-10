

import express from "express"
import protect from "../middleware/authMiddleware.js"
import creditsControllers from "../controllers/creditsControllers.js"

const router = express.Router()

router.post("/" , protect.forUser , creditsControllers.requestCredits )
router.get("/" , protect.forUser , creditsControllers.getAllCreditRequestHistory)
router.get("/:rid" , protect.forUser , creditsControllers.getSingleCreditRequestHistory)
export default router 