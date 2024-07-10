import express from "express";
import loginController from "../controllers/userController.js";
import carFormController from "../controllers/carController.js";
const router = express.Router()


router.post('/login',loginController)
router.post('/addCar',carFormController)

export default router;