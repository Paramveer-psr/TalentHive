import React from "react";

const EmployerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src="src/assets/employee.jpg" alt="Dashboard Background" className="w-full h-full object-cover opacity-60" />
      </div>
      <div className="relative z-10 p-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">Employer Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4">Posted Jobs</h2>
            <ul className="list-disc pl-5">
              <li className="mb-2">Frontend Developer - <span className="font-bold">10 Applications</span></li>
              <li className="mb-2">DevOps Engineer - <span className="font-bold">5 Applications</span></li>
            </ul>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4">New Applications</h2>
            <ul className="list-disc pl-5">
              <li className="mb-2">Jane Doe - <span className="font-bold">React Developer</span></li>
              <li className="mb-2">John Smith - <span className="font-bold">Data Scientist</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
