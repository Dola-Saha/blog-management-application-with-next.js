import { Router } from "express";
import authMiddleWare, { isAdmin } from "../middlewares/auth.middleware.js";
import { getProfile, getUserById, getUsers, updateOwnPassword, updateOwnProfile, updateStatus } from "../controller/users.controller.js";

const router = Router();
router.get("/users", authMiddleWare, isAdmin, getUsers);
router.get("/users/profile", authMiddleWare, getProfile);
router.get("/users/:id", authMiddleWare, isAdmin, getUserById);
router.patch("/users/:id/status", authMiddleWare, isAdmin, updateStatus);
router.put("/users/profile/update", authMiddleWare, updateOwnProfile);
router.patch("/users/password", authMiddleWare, updateOwnPassword);

export default router;