// import { useState, useEffect } from "react";
// import axios from "axios";

// const EditUserProfile = () => {
//   const [formData, setFormData] = useState({
//     firstname: "",
//     secondname: "",
//     email: "",
//     mobileNumber: "",
//     password: ""
//   });

//   const [message, setMessage] = useState("");

// //   useEffect(() => {
// //     axios.get("/api/v1/user/profile")
// //       .then(res => setFormData(res.data))
// //       .catch(err => console.error("Error loading profile", err));
// //   }, []);

//   const handleChange = e => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const res = await axios.put("/api/v1/user/update", formData);
//       setMessage(res.data);
//     } catch (err) {
//       setMessage("Failed to update profile");
//     }
//   };

//   return (
//     <div className="w-full flex justify-center items-center p-6 ">
//   <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-xl">
//     <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-4">Edit Profile</h2>
//     <p className="text-gray-500 text-center mb-6">Update your details below.</p>

//     <form onSubmit={handleSubmit} className="space-y-3">
//       <div>
//         <label className="block text-gray-700 font-medium text-left">First Name:</label>
//         <input
//           type="text"
//           name="firstname"
//           value={formData.firstname}
//           onChange={handleChange}
//           required
//           className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
//         />
//       </div>

//       <div>
//         <label className="block text-gray-700 font-medium text-left">Last Name:</label>
//         <input
//           type="text"
//           name="secondname"
//           value={formData.secondname}
//           onChange={handleChange}
//           required
//           className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
//         />
//       </div>

//       <div>
//         <label className="block text-gray-700 font-medium text-left">Phone Number:</label>
//         <input
//           type="text"
//           name="mobileNumber"
//           value={formData.mobileNumber}
//           onChange={handleChange}
//           required
//           className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
//         />
//       </div>

//       <div>
//         <label className="block text-gray-700 font-medium text-left">Email:</label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//           className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
//         />
//       </div>

//       <div>
//         <label className="block text-gray-700 font-medium text-left">Password:</label>
//         <input
//           type="password"
//           name="password"
//           placeholder="Leave blank to keep current"
//           value={formData.password}
//           onChange={handleChange}
//           className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
//         />
//       </div>

//       <button
//         type="submit"
//         className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-300 transform hover:scale-105"
//       >
//         Save Changes
//       </button>
//     </form>

//     {message && (
//       <p className="mt-4 text-center text-sm text-green-600">{message}</p>
//     )}
//   </div>
// </div>

//   );
// };

// export default EditUserProfile;

import { useState, useEffect } from "react";
import { getUserProfile, editUserProfile } from "../services/Profile";

const EditUserProfile = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    secondname: "",
    email: "",
    mobileNumber: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        setFormData({ ...profile}); 
      } catch (err) {
        console.error("Error loading profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = e => {
    console.log(formData);
    
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Assuming editUserProfile returns the updated profile data
      const updatedProfile = await editUserProfile(formData);
      setFormData(updatedProfile);  // Update the formData with the returned data
      setMessage("Profile updated successfully!");
  
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };
  

  return (
    <div className="w-full flex justify-center items-center p-6 mt-10">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-4">Edit Profile</h2>
        <p className="text-gray-500 text-center mb-6">Update your details below.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-gray-700 font-medium text-left">First Name:</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium text-left">Last Name:</label>
            <input
              type="text"
              name="secondname"
              value={formData.secondname}
              onChange={handleChange}
              required
              className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium text-left">Phone Number:</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium text-left">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-300 transform hover:scale-105"
          >
            Save Changes
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default EditUserProfile;
