// components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ darkMode, setDarkMode, userRole }) {
  const navItems = userRole === "company"
    ? ["Dashboard", "Jobs", "Applications", "Profile", "Logout"]
    : ["Dashboard", "Jobs", "Applied Jobs", "Profile", "Logout"];

  return (
    <aside className="w-64 bg-gray-800 dark:bg-gray-800 p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-6 text-white">Dashboard</h1>
      <ul className="flex-1">
        {navItems.map((item) => (
          <li key={item} className="mb-2">
            <Link
              to={`/dashboard/${userRole.toLowerCase()}`}
              className="block text-white hover:text-gray-300"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded mt-4"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </aside>
  );
}
