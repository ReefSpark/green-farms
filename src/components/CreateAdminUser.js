import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateAdminUser = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validatePhoneNumber(e) {
    const num = e.target.value;
    if (num.length > 10) {
      toast.error("Mobile number should not be greater than 10 digits");
      return;
    }
    setMobileNumber(num);
  }

  async function handleCreateAdmin() {
    if (mobileNumber.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }
    if (!mobileNumber || !password || !username) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/admin/create-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile_no: mobileNumber,
            is_active: true,
            password: password,
            username: username,
            role: Number(role),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Admin user created successfully!");
        navigate("/admin/loginadmin");
      } else {
        toast.error(data.message || "Failed to create admin user");
      }
    } catch (error) {
      toast.error("Error creating admin user. Please check your network.");
      console.error("Create Admin Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-[#f9f8f3] w-[320px] rounded-lg shadow-lg p-6">
        <h1 className="text-center text-lg font-semibold text-gray-800 mb-6">
          Create Admin User
        </h1>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Username</label>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Mobile Number
          </label>
          <input
            type="number"
            placeholder="Enter Mobile Number"
            value={mobileNumber}
            onChange={validatePhoneNumber}
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Select Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="1">Admin</option>
            <option value="2">Delivery</option>
          </select>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
            onClick={handleCreateAdmin}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAdminUser;
