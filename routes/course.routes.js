import { Router } from "express";
import { createCourse, getAllCourses, getLecturesByCourseId, removeCourse, updateCourse } from "../controllers/course.controller.js";
import { isLoggedIn } from "../middelwares/authMiddleware.js";
import upload from "../middelwares/multerMidleware.js";

const router = Router();

router.route("/")
    .get(getAllCourses)
    .post(upload.single("thumbnail"), createCourse);

router.route("/:id")
    .get(isLoggedIn, getLecturesByCourseId)
    .put(updateCourse)
    .delete(removeCourse);

export default router;
