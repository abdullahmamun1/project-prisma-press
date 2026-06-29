import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/register", userController.registerUser);
router.get(
  "/me",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  userController.getMyProfile,
);
router.put(
  "/my-profile",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  userController.updateMyProfile,
);

export const userRoutes = router;
