import React from "react";
import { motion } from "framer-motion";
import {
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Button from "./Button";

const JobCard = ({
  job,
  onClick,
  showApplyButton = true,
  showEditButton = false,
  showDeleteButton = false,
  onApply,
  onEdit,
  onDelete,
  showApplicationCount = false,
  compact = false,
}) => {
  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate days left until deadline
  const getDaysLeft = (dateString) => {
    if (!dateString) return null;

    const deadline = new Date(dateString);
    const today = new Date();

    // Reset time part for accurate day calculation
    deadline.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `${diffDays} days left`;
  };

  // Get badge color based on job type
  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "Full-time":
        return "bg-blue-100 text-blue-800";
      case "Part-time":
        return "bg-green-100 text-green-800";
      case "Contract":
        return "bg-purple-100 text-purple-800";
      case "Freelance":
        return "bg-yellow-100 text-yellow-800";
      case "Internship":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get badge color based on experience level
  const getExperienceBadgeColor = (experience) => {
    switch (experience) {
      case "Entry Level":
        return "bg-green-100 text-green-800";
      case "Mid Level":
        return "bg-blue-100 text-blue-800";
      case "Senior Level":
        return "bg-purple-100 text-purple-800";
      case "Executive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get deadline color based on days left
  const getDeadlineColor = (daysLeft) => {
    if (daysLeft === "Expired") return "text-red-600";
    if (daysLeft === "Today") return "text-orange-600";
    if (daysLeft === "Tomorrow") return "text-yellow-600";
    return "text-green-600";
  };

  const daysLeft = getDaysLeft(job.deadline);

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-300"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3
              className="text-lg md:text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
              onClick={onClick}
            >
              {job.title}
            </h3>
            <p className="text-gray-600 mt-1">{job.company}</p>
          </div>

          {job.logo ? (
            <img
              src={job.logo}
              alt={`${job.company} logo`}
              className="h-12 w-12 object-contain"
            />
          ) : (
            <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
              <BriefcaseIcon className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-gray-600">
            <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span>{job.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span>{job.salary || "Salary not specified"}</span>
          </div>

          {!compact && (
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
              <span>Posted on {formatDate(job.createdAt)}</span>
            </div>
          )}

          {job.deadline && (
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
              <span className={`${getDeadlineColor(daysLeft)}`}>
                {daysLeft} (Deadline: {formatDate(job.deadline)})
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(
              job.type
            )}`}
          >
            {job.type}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getExperienceBadgeColor(
              job.experience
            )}`}
          >
            {job.experience}
          </span>

          {job.category && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {job.category}
            </span>
          )}

          {showApplicationCount && job.applicationCount !== undefined && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {job.applicationCount}{" "}
              {job.applicationCount === 1 ? "Application" : "Applications"}
            </span>
          )}
        </div>

        {/* Skills */}
        {!compact && job.skills && job.skills.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Required Skills:</p>
            <div className="flex flex-wrap gap-1">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2">
          {showApplyButton && (
            <Button variant="primary" size="sm" onClick={onApply || onClick}>
              Apply Now
            </Button>
          )}

          {showEditButton && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
          )}

          {showDeleteButton && (
            <Button variant="danger" size="sm" onClick={onDelete}>
              Delete
            </Button>
          )}

          {!showApplyButton && !showEditButton && !showDeleteButton && (
            <Button variant="outline" size="sm" onClick={onClick}>
              View Details
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
