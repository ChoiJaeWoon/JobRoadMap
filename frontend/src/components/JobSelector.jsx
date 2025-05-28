const jobList = ["Backend", "Frontend","Languages", "Database", "DevOps/Infra", "Mobile", "Data/AI", "Tools/Etc"];

const JobSelector = ({ selectedJob, setSelectedJob }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "0 20px", marginBottom: "20px" }}>
    {jobList.map(job => (
      <button
        key={job}
        onClick={() => setSelectedJob(job)}
        style={{
          backgroundColor: selectedJob === job ? "#007BFF" : "#eee",
          color: selectedJob === job ? "#fff" : "#333",
          border: "none",
          borderRadius: "20px",
          padding: "6px 12px",
          cursor: "pointer"
        }}
      >
        {job}
      </button>
    ))}
  </div>
);

export default JobSelector;
