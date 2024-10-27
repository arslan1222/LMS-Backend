import { Router } from "express";
import { getAllCourses, getLecturesByCourseId } from "../controllers/course.controller.js";
import { isLoggedIn } from "../middelwares/authMiddleware.js";

const router = Router();

router.get("/", isLoggedIn,getAllCourses);

router.get("/:id", isLoggedIn, getLecturesByCourseId);


export default router;