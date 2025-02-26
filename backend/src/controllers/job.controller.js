import { asyncHandler } from "../utils/asyncHandler.js";
import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import axios from "axios";

const createJob = asyncHandler(async (req, res) => {
  const { title, description, skills, experience } = req.body;
  const employer = req.user._id;

  if (!title || !description || !skills || !experience) {
    throw new ApiError(400, "All fields are required");
  }

  const job = await Job.create({
    title,
    description,
    skills,
    experience,
    employer,
  });

  res.status(201).json(new ApiResponse(201, job, "Job Creation Successful."));
});

const getJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const jobs = await Job.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate("employer", "name email");

  res.status(200).json(
    new ApiResponse(200, jobs, "Jobs Fetched Successfully.", {
      total: await Job.countDocuments(),
    })
  );
});

const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate(
    "employer",
    "name email"
  );
  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  res.status(200).json(new ApiResponse(200, job, "Job fetched successfully."));
});

const getJobsForUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const jobs = await Job.find();

  const response = await axios.post(
    `${process.env.AISERVICE_URL}/api/v1/job-matcher`,
    {
      skills: user.skills,
      experience: user.experience,
      jobs,
    }
  );

  const recommendedJobs = response.data.matched_jobs;

  res.status(200).json(
    new ApiResponse(200, recommendedJobs, "Jobs Fetched Successfully.", {
      total: await Job.countDocuments(),
    })
  );
});

export { createJob, getJobs, getJob, getJobsForUser };
