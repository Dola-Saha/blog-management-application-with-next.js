import { Router } from "express";
import authMiddleWare from "../middlewares/auth.middleware.js";
import { create, getAllBlogs, getBlogById, remove, update } from "../controller/blogs.controller.js";

const router = Router();
router.get("/blogs", getAllBlogs);
router.get("/blogs/:id", getBlogById);
router.post("/blogs/create", authMiddleWare, create);
router.put("/blogs/update/:id", authMiddleWare, update);
router.delete("/blogs/delete/:id", authMiddleWare, remove);
router.delete("/blogs/:id", authMiddleWare, remove);

export default router;