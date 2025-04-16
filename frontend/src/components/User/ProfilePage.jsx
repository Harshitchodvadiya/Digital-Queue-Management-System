import { useEffect, useState } from "react";
import {getUserProfile} from "../services/Profile";

import EditUserProfile from "./EditProfilePage"

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);

//   const loadProfile = () => {
//     getUserProfile()
//       .then(res => setUser(res.data))
//       .catch(err => console.error("Failed to fetch profile", err));
//   };

//   useEffect(() => {
//     loadProfile();
//   }, []);

   useEffect(() => {
      const loadProfile = async () => {
        setLoading(true);
        try {
          const userData = await getUserProfile();
          setUser(userData);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch staff members. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      loadProfile();
    }, []);

  if (!user) return <div className="p-4">Loading...</div>;  

  return (
    <div className="bg-gray-100 flex h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
   
    <div className="bg-white rounded-lg shadow-md p-6 w-1/2 h-full">
      <h2 className="text-lg font-bold mb-4">Your Profile</h2>

    <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-2xl h-50 w-full max-w-lg">
      <div className="flex items-center justify-cener mb-2">
        <h3 className="text-lg font-semibold text-gray-700 mr-2">First Name:</h3>
        <p className="text-lg font-semibold text-gray-900">{user.firstname}</p>
      </div>
      <div className="flex items-center justify-cener mb-2">
        <h3 className="text-lg font-semibold text-gray-700 mr-2">Second Name:</h3>
        <p className="text-lg font-semibold text-gray-900">{user.secondname}</p>
      </div>
      <div className="flex items-center justify-cener mb-2">
        <h3 className="text-lg font-semibold text-gray-700 mr-2">Mobile No.:</h3>
        <p className="text-lg font-semibold text-gray-900">{user.mobileNumber}</p>
      </div>
      <div className="flex items-center justify-cener mb-2">
        <h3 className="text-lg font-semibold text-gray-700 mr-2">Email:</h3>
        <p className="text-lg font-semibold text-gray-900">{user.email}</p>
      </div>
      
    </div>

    </div>
    <div className="w-2/3">
      <EditUserProfile/>
      </div>
    </div>
  );
};

export default ProfilePage;
