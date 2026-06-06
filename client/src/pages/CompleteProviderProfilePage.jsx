import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function CompleteProviderProfilePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    profession: "",
    experience: "",
    skills: "",
    hourlyRate: "",
    location: "",
    bio: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      await API.post(
        "/providers",
        {
          ...formData,
          skills: formData.skills
            .split(",")
            .map((skill) => skill.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      alert("Provider profile created");

      window.location.href = "/dashboard";
    } catch (error) {
      console.log(error);

      alert("Failed to create profile");
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen flex justify-center items-center p-8">
      <div className="bg-slate-800 p-8 rounded-xl w-full max-w-xl shadow-lg">

        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Complete Provider Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="profession"
            placeholder="Profession"
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
          />

          <input
            type="number"
            name="experience"
            placeholder="Experience (Years)"
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
          />

          <input
            type="number"
            name="hourlyRate"
            placeholder="Hourly Rate"
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
          />

          <textarea
            name="bio"
            rows="4"
            placeholder="Bio"
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            Create Profile
          </button>

        </form>
      </div>
    </div>
  );
}

export default CompleteProviderProfilePage;