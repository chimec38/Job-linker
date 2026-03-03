import { useState } from "react";
import api from "../../api/axios";

const CVUpload = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("cv", file);
    try {
      await api.put("/auth/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("CV uploaded successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload CV</button>
    </div>
  );
};

export default CVUpload;
