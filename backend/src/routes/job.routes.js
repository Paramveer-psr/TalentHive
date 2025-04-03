import express from "express";

import {
  createJob,
  getJobs,
  getJob,
  getJobsForUser,
  updateJob,
  applyForJob,
  updateApplicationStatus,
} from "../controllers/job.controller.js";
import { roleCheck, verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Employer routes
router.post("/create", verifyJWT, roleCheck(["employer"]), createJob);
router.put("/:id", verifyJWT, roleCheck(["employer"]), updateJob);
router.get("/", verifyJWT, roleCheck(["employer"]), getJobs);
router.get("/:id", verifyJWT, roleCheck(["employer", "jobseeker"]), getJob);
router.put(
  "/:jobId/applications/:applicationId/status",
  verifyJWT,
  roleCheck(["employer"]),
  updateApplicationStatus
);

// Jobseeker routes
router.get("/recommended", verifyJWT, roleCheck(["jobseeker"]), getJobsForUser);
router.post("/:id/apply", verifyJWT, roleCheck(["jobseeker"]), applyForJob);

export default router;
