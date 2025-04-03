import { asyncHandler } from "../utils/asyncHandler.js";
import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import axios from "axios";

const createJob = asyncHandler(async (req, res) => {
  const { title, description, skills, experience, location, companyName } =
    req.body;
  const employer = req.user._id;

  if (
    !title ||
    !description ||
    !skills ||
    !experience ||
    !location ||
    !companyName
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const job = await Job.create({
    title,
    description,
    skills,
    experience,
    location,
    companyName,
    employer,
  });

  res.status(201).json(new ApiResponse(201, job, "Job Creation Successful."));
});

const updateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    skills,
    experience,
    location,
    companyName,
    isActive,
  } = req.body;

  const job = await Job.findById(id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.employer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own jobs");
  }

  const updatedJob = await Job.findByIdAndUpdate(
    id,
    {
      title,
      description,
      skills,
      experience,
      location,
      companyName,
      isActive,
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedJob, "Job updated successfully."));
});

const getJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const jobs = await Job.find({ isActive: true })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate("employer", "name email");

  res.status(200).json(
    new ApiResponse(200, jobs, "Jobs Fetched Successfully.", {
      total: await Job.countDocuments({ isActive: true }),
    })
  );
});

const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("employer", "name email")
    .populate("applications.user", "name email skills experience");

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

  const jobs = await Job.find({ isActive: true });

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
      total: await Job.countDocuments({ isActive: true }),
    })
  );
});

const applyForJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { resume, coverLetter } = req.body;

  const job = await Job.findById(id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (!job.isActive) {
    throw new ApiError(400, "This job is no longer active");
  }

  // Check if user has already applied
  const hasApplied = job.applications.some(
    (app) => app.user.toString() === req.user._id.toString()
  );

  if (hasApplied) {
    throw new ApiError(400, "You have already applied for this job");
  }

  job.applications.push({
    user: req.user._id,
    resume,
    coverLetter,
  });

  await job.save();

  res
    .status(200)
    .json(new ApiResponse(200, job, "Application submitted successfully."));
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { jobId, applicationId } = req.params;
  const { status } = req.body;

  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.employer.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You can only update applications for your own jobs"
    );
  }

  const application = job.applications.id(applicationId);
  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  application.status = status;
  await job.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, job, "Application status updated successfully.")
    );
});

export {
  createJob,
  getJobs,
  getJob,
  getJobsForUser,
  updateJob,
  applyForJob,
  updateApplicationStatus,
};
