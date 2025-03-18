import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useState } from "react";

const AddUser = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const location = useLocation();
  console.log("location", location);
  const userType = location.state?.userType || "default";
  const [role, setRole] = useState(userType);
  function validatePhoneNumber(e) {
    const num = e.target.value;
    if (num.length > 10) {
      alert("Mobile number should not be greater than 10 digits");
      return;
    }
    setMobileNumber(num);
  }
  async function handleCreateAdmin() {
    if (!username || !password || !mobileNumber) {
      toast.error("All fields are required!");
      return;
    }
    if (mobileNumber.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits!");
      return;
    }

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
        toast.success(" added successfully!");
        navigate("/admin/User");
      } else {
        toast.error(data.message || "Failed to create admin user");
      }
    } catch (error) {
      toast.error("Error creating admin user. Please check your network.");
      console.error("Create Admin Error:", error);
    }
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/admin/user")}
          className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold mb-4">Add/Edit User</h1>
        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-sm mb-1">
                User Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-sm mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-sm mb-1">
                  Phone Number
                </label>
                <input
                  type="number"
                  value={mobileNumber}
                  onChange={validatePhoneNumber}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                  required
                />
              </div>
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

            {/* Add User Button */}
            <div>
              <button
                type="button"
                onClick={handleCreateAdmin}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
