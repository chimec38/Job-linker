// CompanyDashboard.jsx - WITH ORIGINAL COLORS
import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import UserDropdown from "../components/UserDropdown";
import "../styles/CompanyDashboard.css";

export default function CompanyDashboard() {
  const [jobs, setJobs] = useState([
    { id: 1, title: "Frontend Developer", applications: 5 },
    { id: 2, title: "Backend Developer", applications: 3 },
    { id: 3, title: "UI/UX Designer", applications: 2 },
  ]);

  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobDesc, setNewJobDesc] = useState("");

  const handleAddJob = (e) => {
    e.preventDefault();
    if (!newJobTitle) return;
    const newJob = { id: jobs.length + 1, title: newJobTitle, applications: 0 };
    setJobs([newJob, ...jobs]);
    setNewJobTitle("");
    setNewJobDesc("");
  };

  const chartData = jobs.map((job) => ({
    name: job.title,
    applications: job.applications,
  }));

  return (
    <div className="company-dashboard-container">
      <header className="dashboard-header">
        <h2>Company Dashboard</h2>
        <div className="header-right">
          <UserDropdown />
        </div>
      </header>

      <div className="stats-cards">
        <div className="card">
          <h3>Total Jobs</h3>
          <p>{jobs.length}</p>
        </div>
        <div className="card">
          <h3>Total Applications</h3>
          <p>{jobs.reduce((sum, job) => sum + job.applications, 0)}</p>
        </div>
        <div className="card">
          <h3>Active Jobs</h3>
          <p>{jobs.length}</p>
        </div>
      </div>

      <form className="job-post-form" onSubmit={handleAddJob}>
        <h3>Post a New Job</h3>
        <input
          type="text"
          placeholder="Job Title"
          value={newJobTitle}
          onChange={(e) => setNewJobTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Job Description (optional)"
          value={newJobDesc}
          onChange={(e) => setNewJobDesc(e.target.value)}
        />
        <button type="submit">Post Job</button>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Applications</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.applications}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="chart-container">
        <h3>Applications per Job</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
            <YAxis stroke="rgba(255,255,255,0.7)" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1a1a2e", border: "none", color: "white" }}
            />
            <Line type="monotone" dataKey="applications" stroke="#9b5cff" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}