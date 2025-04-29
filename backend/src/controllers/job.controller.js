import { asyncHandler } from "../utils/asyncHandler.js";
import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import axios from "axios";

const createJob = asyncHandler(async (req, res) => {
  // console.log("Creating job...");
  try {
    // console.log("Request body:", req.body);
    const {
      title,
      description,
      skills,
      experience,
      location,
      companyName,
      jobType,
      salary,
    } = req.body;
    const employer = req.user._id;

    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!description) missingFields.push("description");
    if (!skills) missingFields.push("skills");
    if (!experience) missingFields.push("experience");
    if (!location) missingFields.push("location");
    if (!companyName) missingFields.push("companyName");
    if (!jobType) missingFields.push("jobType");
    if (!salary) missingFields.push("salary");

    if (missingFields.length > 0) {
      throw new ApiError(
        400,
        `Missing required fields: ${missingFields.join(", ")}`
      );
    }

    const job = await Job.create({
      title,
      description,
      skills,
      experience,
      location,
      companyName,
      salary,
      jobType,
      employer,
    });

    res.status(201).json(new ApiResponse(201, job, "Job Creation Successful."));
  } catch (error) {
    console.error("Error creating job:", error);
    throw new ApiError(500, "Internal Server Error");
  }
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
    jobType,
    salary,
    isActive,
  } = req.body;

  // console.log(typeof isActive, isActive);

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
      jobType,
      salary,
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedJob, "Job updated successfully."));
});

const getJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const jobs = await Job.find({ employer: req.user._id })
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
  try {
    console.log("Fetching jobs for user...");
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const jobs = await Job.find({ isActive: true });

    // Map experience strings to numeric values for the AI service
    const experienceMap = {
      "Entry Level": 0,
      Internship: 0,
      Fresher: 0,
      "Mid Level": 3,
      "Senior Level": 5,
      Executive: 8,
    };

    // Convert user's experience to numeric value
    const userExperienceNumeric = experienceMap[user.experience] || 0;

    // Prepare jobs data with numeric experience values
    const jobsForMatching = jobs.map((job) => {
      // Convert to a plain JavaScript object that can be serialized to JSON
      const jobObj = job.toObject ? job.toObject() : { ...job };

      // Add numeric experience value
      jobObj.experienceNumeric = experienceMap[jobObj.experience] || 0;

      return jobObj;
    });

    const response = await axios.post(
      `${process.env.AISERVICE_URL}/api/v1/job-matcher`,
      {
        skills: user.skills,
        experience: userExperienceNumeric,
        jobs: jobsForMatching,
      }
    );

    const recommendedJobs = response.data.matched_jobs;

    res.status(200).json(
      new ApiResponse(200, recommendedJobs, "Jobs Fetched Successfully.", {
        total: await Job.countDocuments({ isActive: true }),
      })
    );
  } catch (error) {
    console.error("Error fetching jobs for user:", error);
    throw new ApiError(500, "Internal Server Error");
  }
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

const deleteJob = asyncHandler(async (req, res) => {
  // console.log(req.params);
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You can only delete your own jobs");
    }

    await job.deleteOne();

    res
      .status(200)
      .json(new ApiResponse(200, null, "Job deleted successfully."));
  } catch (error) {
    console.error("Error deleting job:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

export {
  createJob,
  getJobs,
  getJob,
  getJobsForUser,
  updateJob,
  applyForJob,
  updateApplicationStatus,
  deleteJob,
};
