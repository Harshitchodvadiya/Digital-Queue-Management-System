import { useEffect, useState } from "react";
import { getUserProfile } from "../services/Profile";
import EditUserProfile from "./EditProfilePage";
import Navbar from "../Navbar";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await getUserProfile();
        console.log("Fetched profile:", userData);
        setUser(userData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) return <div className="text-white p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">  
      <Navbar/>
      <div className="p-2 ml-20">
              <button
                onClick={() => navigate("/user")}
                className=" text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition duration-200"
              >
              <IoIosArrowBack  className="h-5 w-5"/>
              </button>
      </div> 

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full ml-30 mt-10 max-w-6xl">
     
        <div className="bg-white backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-black">
          
          <h2 className="text-3xl font-bold mb-6 text-center">Your Profile</h2>
          <div className="space-y-4 text-lg">
            <div>
              <span className="font-semibold">First Name:</span> {user.firstname}
            </div>
            <div>
              <span className="font-semibold">Second Name:</span> {user.secondname}
            </div>
            <div>
              <span className="font-semibold">Mobile Number:</span> {user.mobileNumber}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {user.email}
            </div>
          </div>
        </div>
        {/* 👇 Pass setUser and user to EditUserProfile */}
        <EditUserProfile user={user} setUser={setUser} />
      </div>
    </div>
  );
};

export default ProfilePage;
