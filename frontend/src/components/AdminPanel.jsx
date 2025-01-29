import React from "react";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src="src/assets/admin.png" alt="Dashboard Background" className="w-full h-full object-cover opacity-90" />
      </div>
      <div className="relative z-10 p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Admin Panel</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-2">Total Users</h2>
            <p className="text-3xl font-bold">120</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-2">Active Jobs</h2>
            <p className="text-3xl font-bold">45</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-2">Applications</h2>
            <p className="text-3xl font-bold">300</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
