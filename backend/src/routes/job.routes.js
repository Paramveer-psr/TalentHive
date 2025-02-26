import express from "express";

import {
  createJob,
  getJobs,
  getJob,
  getJobsForUser,
} from "../controllers/job.controller.js";
import { roleCheck, verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyJWT, roleCheck(["employer"]), createJob);
router.get("/recommended", verifyJWT, roleCheck(["jobseeker"]), getJobsForUser);
router.get("/", verifyJWT, roleCheck(["employer"]), getJobs);
router.get("/:id", verifyJWT, roleCheck(["employer"]), getJob);

export default router;
