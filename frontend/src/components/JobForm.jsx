import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Input from "./Input";
import Button from "./Button";
import Alert from "./Alert";
import { employerService } from "../utils/ApiService";

const JobForm = ({
  initialData = null,
  onSuccess,
  onCancel,
  isEdit = false,
}) => {
  const defaultFormData = {
    title: "",
    companyName: "",
    location: "",
    description: "",
    skills: "",
    experience: "Entry Level",
    isActive: true,
  };

  const [formData, setFormData] = useState(initialData || defaultFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Format skills as array if it's a string
      const formattedData = {
        ...formData,
        skills:
          typeof formData.skills === "string"
            ? formData.skills.split(",").map((skill) => skill.trim())
            : formData.skills,
      };

      let response;
      if (isEdit && initialData?._id) {
        response = await employerService.updateJob(
          initialData._id,
          formattedData
        );
        setSuccess("Job updated successfully!");
      } else {
        response = await employerService.createJob(formattedData);
        setSuccess("Job created successfully!");
      }

      // Reset form if not editing
      if (!isEdit) {
        setFormData(defaultFormData);
      }

      // Call onSuccess callback with the response data
      if (onSuccess) {
        onSuccess(response.data.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} job. Please try again.`
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
        <Input
          label="Job Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <Input
          label="Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
        />

        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <Input
          label="Skills (comma-separated)"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          required
          placeholder="e.g., JavaScript, React, Node.js"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Experience Level
          </label>
          <select
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
            <option value="Executive">Executive</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Active Job Posting
          </label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" loading={loading} className="flex-1">
            {isEdit ? "Update Job" : "Create Job"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default JobForm;
