// import { useState, useEffect } from "react";
// import { getUserProfile, editUserProfile } from "../services/Profile";

// const EditUserProfile = () => {
//   const [formData, setFormData] = useState({
//     firstname: "",
//     secondname: "",
//     mobileNumber: ""
//   });

//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const profile = await getUserProfile();
//         setFormData({ ...profile}); 
//       } catch (err) {
//         console.error("Error loading profile", err);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleChange = e => {    
//     // setFormData({ ...formData, [e.target.name]: e.target.value });
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       // Assuming editUserProfile returns the updated profile data
//       const updatedProfile = await editUserProfile(formData);
//       console.log(updatedProfile);
//       setFormData(updatedProfile);  // Update the formData with the returned data
//       console.log(updatedProfile);
      
//       setMessage("Profile updated successfully!");
  
//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to update profile.");
//     }
//   };
  

//   return (
//     <div className="w-full flex justify-center items-center p-6 mt-10">
//       <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-xl">
//         <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-4">Edit Profile</h2>
//         <p className="text-gray-500 text-center mb-6">Update your details below.</p>

//         <form onSubmit={handleSubmit} className="space-y-3">
//           <div>
//             <label className="block text-gray-700 font-medium text-left">First Name:</label>
//             <input
//               type="text"
//               name="firstname"
//               value={formData.firstname}
//               onChange={handleChange}
//               required
//               className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-medium text-left">Last Name:</label>
//             <input
//               type="text"
//               name="secondname"
//               value={formData.secondname}
//               onChange={handleChange}
//               required
//               className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-medium text-left">Phone Number:</label>
//             <input
//               type="text"
//               name="mobileNumber"
//               value={formData.mobileNumber}
//               onChange={handleChange}
//               required
//               className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-300 transform hover:scale-105"
//           >
//             Save Changes
//           </button>
//         </form>

//         {message && (
//           <p className="mt-4 text-center text-sm text-green-600">{message}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EditUserProfile;


import { useState, useEffect } from "react";
import { getUserProfile, editUserProfile } from "../services/Profile";

const EditUserProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    mobileNumber: ""
  });  

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        // Ensure each field is at least an empty string to avoid "null" or "undefined"
        setFormData({
          firstName: profile?.firstName ?? "",
          secondName: profile?.secondName ?? "",
          mobileNumber: profile?.mobileNumber ?? ""
        });
        // setFormData({ ...profile}); 
        console.log(profile);
      } catch (err) {
        console.error("Error loading profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const updatedProfile = await editUserProfile(formData);
      console.log(updatedProfile);
      
      setFormData({
        firstName: updatedProfile?.firstName ?? "",
        secondName: updatedProfile?.secondName ?? "",
        mobileNumber: updatedProfile?.mobileNumber ?? ""
      });
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
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium text-left">Second Name:</label>
            <input
              type="text"
              name="secondName"
              value={formData.secondName}
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
