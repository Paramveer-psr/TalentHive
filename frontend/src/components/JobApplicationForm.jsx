import React, { useState } from "react";
import { motion } from "framer-motion";
import Input from "./Input";
import Button from "./Button";
import Alert from "./Alert";
import { jobService } from "../utils/ApiService";

const JobApplicationForm = ({ jobId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    coverLetter: "",
    resumeUrl: "",
    phoneNumber: "",
    availability: "Immediately",
    portfolioUrl: "",
    additionalInfo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await jobService.applyForJob(jobId, formData);
      setSuccess("Application submitted successfully!");

      // Reset form
      setFormData({
        coverLetter: "",
        resumeUrl: "",
        phoneNumber: "",
        availability: "Immediately",
        portfolioUrl: "",
        additionalInfo: "",
      });

      // Call onSuccess callback
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {error && <Alert type="error" message={error} className="mb-4" />}

      {success && <Alert type="success" message={success} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="resumeUrl"
            name="resumeUrl"
            label="Resume URL"
            value={formData.resumeUrl}
            onChange={handleChange}
            placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
            required
          />

          <Input
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="e.g. +1 (123) 456-7890"
            required
          />

          <div>
            <label
              htmlFor="availability"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Availability
            </label>
            <select
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Immediately">Immediately</option>
              <option value="1 week">1 week</option>
              <option value="2 weeks">2 weeks</option>
              <option value="1 month">1 month</option>
              <option value="More than 1 month">More than 1 month</option>
            </select>
          </div>

          <Input
            id="portfolioUrl"
            name="portfolioUrl"
            label="Portfolio URL (Optional)"
            value={formData.portfolioUrl}
            onChange={handleChange}
            placeholder="e.g. https://yourportfolio.com"
          />
        </div>

        <div>
          <label
            htmlFor="coverLetter"
            className="block text-sm font-medium mb-1 text-gray-700"
          >
            Cover Letter
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Introduce yourself and explain why you're a good fit for this position..."
            required
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="additionalInfo"
            className="block text-sm font-medium mb-1 text-gray-700"
          >
            Additional Information (Optional)
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any additional information you'd like to share..."
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" isLoading={loading}>
            Submit Application
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default JobApplicationForm;
