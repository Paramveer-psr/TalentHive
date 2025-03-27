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
    company: "",
    location: "",
    type: "Full-time",
    category: "Technology",
    experience: "Entry Level",
    salary: "",
    description: "",
    requirements: "",
    skills: "",
    deadline: "",
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="title"
            name="title"
            label="Job Title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Senior React Developer"
            required
          />

          <Input
            id="company"
            name="company"
            label="Company Name"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. TechCorp Inc."
            required
          />

          <Input
            id="location"
            name="location"
            label="Location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. New York, NY (or Remote)"
            required
          />

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Job Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Technology">Technology</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Sales">Sales</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="experience"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Experience Level
            </label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          <Input
            id="salary"
            name="salary"
            label="Salary Range"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g. $60,000 - $80,000"
          />

          <Input
            id="deadline"
            name="deadline"
            type="date"
            label="Application Deadline"
            value={formData.deadline}
            onChange={handleChange}
          />

          <Input
            id="skills"
            name="skills"
            label="Required Skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, MongoDB (comma separated)"
            className="md:col-span-2"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1 text-gray-700"
          >
            Job Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the job role, responsibilities, and other details..."
            required
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="requirements"
            className="block text-sm font-medium mb-1 text-gray-700"
          >
            Requirements
          </label>
          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="List the requirements for this position..."
            required
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" isLoading={loading}>
            {isEdit ? "Update Job" : "Create Job"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default JobForm;
