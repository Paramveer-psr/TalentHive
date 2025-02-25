import { asyncHandler } from "../utils/asyncHandler.js";
import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

  res.status(201).json(new ApiResponse(201, "Job Creation Successful.", job));
});

const getJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const jobs = await Job.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate("employer", "name email");

  res.status(200).json(
    new ApiResponse(200, "Jobs Fetched Successfully.", jobs, {
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
  res.status(200).json(new ApiResponse(200, "Job fetched successfully.", job));
});
`	44`;

export { createJob, getJobs, getJob };
