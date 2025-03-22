import express from "express";
import userController from "../controllers/user.controller.js";
import { authenticated, authorize, checkOwnerUserId, } from "../middlewares/authorize.middleware.js";
import { validateJsonBody } from "../middlewares/validate.middleware.js";
import { userSchema } from "../validations/user.validation.js";

const router = express.Router();

router.post("/register", validateJsonBody(userSchema), userController.register);
router.get("", authenticated, authorize("ADMIN"), userController.getAllUsers);
router.put("/change-password", authenticated, authorize("TRAVELER", "TOUR_GUIDE"), userController.changePassword);
router.get("/:id", authenticated, authorize("ADMIN", "TRAVELER", "TOUR_GUIDE"), checkOwnerUserId, userController.findUserById);

export default router;
