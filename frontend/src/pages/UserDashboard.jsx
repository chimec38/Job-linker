import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import UserDropdown from "../components/UserDropdown";
import "../styles/UserDashboard.css";

export default function UserDashboard() {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([
    { id: 1, title: "Frontend Developer", status: "Pending" },
    { id: 2, title: "Backend Developer", status: "Accepted" },
    { id: 3, title: "UI/UX Designer", status: "Rejected" },
  ]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => setFiles([...files, ...acceptedFiles]),
  });

  const filteredJobs = appliedJobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = [
    { month: "Jan", applications: 2 },
    { month: "Feb", applications: 5 },
    { month: "Mar", applications: 3 },
  ];

  // Function to get status badge class
  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'accepted': return 'status-badge status-accepted';
      case 'pending': return 'status-badge status-pending';
      case 'rejected': return 'status-badge status-rejected';
      default: return 'status-badge';
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>User Dashboard</h2>
        <div className="header-right">
          <UserDropdown />
        </div>
      </header>

      <div className="stats-cards">
        <div className="card">
          <h3>Total Jobs Applied</h3>
          <p>{appliedJobs.length}</p>
        </div>
        <div className="card">
          <h3>CVs Uploaded</h3>
          <p>{files.length}</p>
        </div>
        <div className="card">
          <h3>Active Applications</h3>
          <p>{appliedJobs.filter((j) => j.status === "Pending").length}</p>
        </div>
      </div>

      <div {...getRootProps()} className="cv-upload">
        <input {...getInputProps()} />
        <p>Drag & drop your CV here, or click to select files</p>
      </div>

      {files.length > 0 && (
        <ul className="cv-list">
          {files.map((file, index) => (
            <li key={index}>
              📄 {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </li>
          ))}
        </ul>
      )}

      <input
        type="text"
        placeholder="Search applied jobs..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-container">
        <h3>My Applications</h3>
        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>
                  <span className={getStatusClass(job.status)}>
                    {job.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="chart-container">
        <h3>Applications Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
            <YAxis stroke="rgba(255,255,255,0.7)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 15, 26, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: "white"
              }}
            />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="#9b5cff"
              strokeWidth={3}
              dot={{ fill: "#9b5cff", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: "#9b5cff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}