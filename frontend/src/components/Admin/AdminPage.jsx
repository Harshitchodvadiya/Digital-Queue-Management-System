import Navbar from "../Navbar";

function AdminPage() {

  return (
      <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white overflow-hidden">
      <Navbar />
      <div className="h-full w-full flex bg-gradient-to-br from-blue-900 via-black to-gray-900 text-white overflow-hidden ">
        
      
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center flex-grow p-6">
          <h2 className="text-4xl font-bold mb-6">Welcome to Admin Panel</h2>
          <p className="text-lg text-gray-300">Manage staff and system settings efficiently.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
