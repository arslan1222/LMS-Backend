import { Router } from "express";
import { forgotPassword, getProfile, login, logout, register, resetPassword } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middelwares/authMiddleware.js";
import upload from "../middelwares/multerMidleware.js";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isLoggedIn, getProfile);
router.post("/forgot/password", forgotPassword);
router.post("/reset", resetPassword);



export default router;