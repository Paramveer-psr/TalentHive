import React from "react";

const EmployerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Posted Jobs</h2>
          <ul>
            <li className="mb-2">Frontend Developer - 10 Applications</li>
            <li className="mb-2">DevOps Engineer - 5 Applications</li>
          </ul>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">New Applications</h2>
          <ul>
            <li className="mb-2">Jane Doe - React Developer</li>
            <li className="mb-2">John Smith - Data Scientist</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
