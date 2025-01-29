import React from "react";

const JobSeekerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src="src/assets/employee.jpg" alt="Dashboard Background" className="w-full h-full object-cover opacity-60" />
      </div>
      <div className="relative z-10 p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-primary">Job Seeker Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-2">Recommended Jobs</h2>
            <ul>
              <li className="mb-2">Software Developer at XYZ Corp</li>
              <li className="mb-2">Data Analyst at ABC Ltd</li>
            </ul>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-2">My Applications</h2>
            <ul>
              <li className="mb-2">Backend Engineer - Pending</li>
              <li className="mb-2">UI/UX Designer - Shortlisted</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
