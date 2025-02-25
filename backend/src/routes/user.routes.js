import express from "express";
import {
  signUp,
  signIn,
  verifyEmail,
  sendPasswordResetEmail,
  resetPassword,
  signOut,
  setProfile,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../utils/supabase.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/signout", verifyJWT, signOut);
router.get("/verifyEmail/:token", verifyEmail);
router.post("/sendPasswordResetEmail", sendPasswordResetEmail);
router.post("/resetPassword", resetPassword);
router.post("/setProfile", verifyJWT, upload.single("file"), setProfile);

export default router;
