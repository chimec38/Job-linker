const JobCard = ({ job }) => (
  <div className="job-card">
    <h3>{job.title}</h3>
    <p>{job.description}</p>
    <p>Company: {job.company_name}</p>
  </div>
);

export default JobCard;
