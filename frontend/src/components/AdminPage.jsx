import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-black to-gray-900 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Content Section */}
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <h2 className="text-4xl font-bold mb-6">Admin Panel</h2>

        {/* Add Staff Button */}
        <button
          onClick={() => navigate("/add-staff")}
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105"
        >
          Add Staff
        </button>
      </div>
    </div>
  );
}

export default AdminPage;
