import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CalendarIcon,
  UserGroupIcon,
  EyeIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Mock data for posted jobs
const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior React Developer",
    applications: 12,
    views: 245,
    status: "Active",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    posted: "2023-03-15",
    description:
      "We are looking for an experienced React developer to join our team and help build our next-generation web applications.",
    requirements: [
      "5+ years of experience with React",
      "Strong knowledge of JavaScript and TypeScript",
      "Experience with state management libraries (Redux, MobX)",
      "Understanding of responsive design principles",
    ],
  },
  {
    id: 2,
    title: "UX/UI Designer",
    applications: 8,
    views: 189,
    status: "Active",
    location: "Remote",
    type: "Full-time",
    salary: "$90,000 - $110,000",
    posted: "2023-03-10",
    description:
      "Join our creative team as a UX/UI Designer to create beautiful and intuitive user interfaces for our clients.",
    requirements: [
      "3+ years of experience in UX/UI design",
      "Proficiency with design tools (Figma, Adobe XD)",
      "Portfolio showcasing your design process",
      "Experience with user research and testing",
    ],
  },
  {
    id: 3,
    title: "Backend Engineer",
    applications: 5,
    views: 120,
    status: "Active",
    location: "New York, NY",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    posted: "2023-03-05",
    description:
      "We're seeking a talented Backend Engineer to develop and maintain our server infrastructure.",
    requirements: [
      "4+ years of experience in backend development",
      "Proficiency with Node.js and Python",
      "Experience with MongoDB and SQL databases",
      "Knowledge of AWS or other cloud platforms",
    ],
  },
  {
    id: 4,
    title: "Product Manager",
    applications: 15,
    views: 310,
    status: "Closed",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    posted: "2023-02-20",
    description:
      "Lead our product development efforts by defining product vision, strategy, and roadmap.",
    requirements: [
      "5+ years of product management experience",
      "Strong analytical and problem-solving skills",
      "Experience with Agile methodologies",
      "Excellent communication and leadership abilities",
    ],
  },
  {
    id: 5,
    title: "DevOps Engineer",
    applications: 3,
    views: 95,
    status: "Active",
    location: "Remote",
    type: "Full-time",
    salary: "$125,000 - $155,000",
    posted: "2023-03-01",
    description:
      "Help us build and maintain our cloud infrastructure and deployment pipelines.",
    requirements: [
      "3+ years of DevOps experience",
      "Proficiency with Docker and Kubernetes",
      "Experience with CI/CD pipelines",
      "Knowledge of infrastructure as code (Terraform, CloudFormation)",
    ],
  },
];

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: "",
  });

  // Get user data and fetch jobs
  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    // Simulate API call to fetch jobs
    setTimeout(() => {
      setJobs(MOCK_JOBS);
      setFilteredJobs(MOCK_JOBS);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter jobs based on search term and filters
  useEffect(() => {
    let results = jobs;

    // Apply search term filter
    if (searchTerm) {
      results = results.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));

      results = results.filter((job) => {
        const jobDate = new Date(job.posted);
        if (dateFilter === "30days") {
          return jobDate >= thirtyDaysAgo;
        } else if (dateFilter === "90days") {
          return jobDate >= ninetyDaysAgo;
        }
        return true;
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter(
        (job) => job.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredJobs(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, dateFilter, statusFilter, jobs]);

  // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle job creation
  const handleCreateJob = (e) => {
    e.preventDefault();

    // Validate form
    if (
      !newJob.title ||
      !newJob.location ||
      !newJob.salary ||
      !newJob.description
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Create new job object
    const job = {
      id: jobs.length + 1,
      ...newJob,
      applications: 0,
      views: 0,
      status: "Active",
      posted: new Date().toISOString().split("T")[0],
      requirements: newJob.requirements
        .split("\n")
        .filter((req) => req.trim() !== ""),
    };

    // Add to jobs list
    setJobs([job, ...jobs]);

    // Reset form and close modal
    setNewJob({
      title: "",
      location: "",
      type: "Full-time",
      salary: "",
      description: "",
      requirements: "",
    });
    setShowPostJobModal(false);
  };

  // Handle job deletion
  const handleDeleteJob = () => {
    if (!selectedJob) return;

    // Filter out the selected job
    const updatedJobs = jobs.filter((job) => job.id !== selectedJob.id);
    setJobs(updatedJobs);

    // Close modal and reset selected job
    setShowDeleteModal(false);
    setSelectedJob(null);
  };

  // Handle input change for new job form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Header
      <div className="bg-primary text-white py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">Employer Dashboard</h1>
          {user && (
            <p className="mt-2">
              Welcome back, {user.name}! Manage your job listings and track
              applications.
            </p>
          )}
        </div>
      </div> */}

        {/* Stats Overview */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Jobs</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {jobs.filter((job) => job.status === "Active").length}
                  </h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <BriefcaseIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Applications</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {jobs.reduce((total, job) => total + job.applications, 0)}
                  </h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <UserGroupIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Views</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {jobs.reduce((total, job) => total + job.views, 0)}
                  </h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <EyeIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Job Listings Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
                Your Job Listings
              </h2>
              <button
                onClick={() => setShowPostJobModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Post New Job</span>
              </button>
            </div>

            {/* Filters and Search */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search job titles or locations"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Dates</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Job Listings Table */}
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">
                  No jobs found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setDateFilter("all");
                    setStatusFilter("all");
                  }}
                  className="mt-2 text-primary hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Posted Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applications
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentJobs.map((job) => (
                      <motion.tr
                        key={job.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {job.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {job.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {job.posted}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {job.applications}
                          </div>
                          <div className="text-xs text-gray-500">
                            {job.views} views
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              job.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            onClick={() => {
                              setSelectedJob(job);
                              // In a real app, you would navigate to an edit page or open an edit modal
                              console.log("Edit job:", job);
                            }}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => {
                              setSelectedJob(job);
                              setShowDeleteModal(true);
                            }}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>

                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === pageNumber
                                ? "bg-primary text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}

                      <button
                        onClick={() =>
                          paginate(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${
                          currentPage === totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Post Job Modal */}
        {showPostJobModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800">
                  Post a New Job
                </h3>
                <button
                  onClick={() => setShowPostJobModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleCreateJob} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title*
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newJob.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Senior React Developer"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location*
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={newJob.location}
                        onChange={handleInputChange}
                        placeholder="e.g. San Francisco, CA or Remote"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Type*
                      </label>
                      <select
                        name="type"
                        value={newJob.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salary Range*
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={newJob.salary}
                      onChange={handleInputChange}
                      placeholder="e.g. $80,000 - $100,000"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Description*
                    </label>
                    <textarea
                      name="description"
                      value={newJob.description}
                      onChange={handleInputChange}
                      placeholder="Describe the role, responsibilities, and ideal candidate..."
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows="4"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requirements (one per line)
                    </label>
                    <textarea
                      name="requirements"
                      value={newJob.requirements}
                      onChange={handleInputChange}
                      placeholder="e.g. 3+ years of experience with React&#10;Strong knowledge of JavaScript&#10;Experience with state management libraries"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows="4"
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowPostJobModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      Post Job
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Confirm Deletion
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete the job listing "
                  {selectedJob.title}"? This action cannot be undone.
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteJob}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default EmployerDashboard;
