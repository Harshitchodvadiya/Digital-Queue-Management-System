import { useState, useEffect } from "react";
import { editUserProfile } from "../services/Profile";

const EditUserProfile = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    mobileNumber: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user?.firstname ?? "",
        secondName: user?.secondname ?? "",
        mobileNumber: user?.mobileNumber ?? ""
      });
    }
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const updatedProfile = await editUserProfile(formData);
      setUser(updatedProfile); // ⬅️ This updates the main profile instantly
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur-lg shadow-xl rounded-3xl p-6 w-full max-w-md mx-auto mt-4">
      <h2 className="text-2xl font-bold text-white mb-3 text-center">Edit Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white text-sm mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <div>
          <label className="block text-white text-sm mb-1">Second Name</label>
          <input
            type="text"
            name="secondName"
            value={formData.secondName}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <div>
          <label className="block text-white text-sm mb-1">Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all"
        >
          Save Changes
        </button>
      </form>
      {message && <p className="text-center mt-4 text-green-300">{message}</p>}
    </div>
  );
};

export default EditUserProfile;
