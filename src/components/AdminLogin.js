import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
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

  async function handleLogin() {
    if (!mobileNumber || !password) {
      toast.error("Please enter both mobile number and password");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile_no: mobileNumber,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const token1 = data?.data?.attributes?.token;
        const roleId = data?.data?.attributes?.role;
        const userName = data?.data?.attributes?.username;
        const userID = data?.data?.attributes?.user_id;
        console.log("userId", userID);
        toast.success("Login successful!");
        localStorage.setItem("authToken", token1);
        localStorage.setItem("userRole", roleId);
        localStorage.setItem("userName", userName);
        localStorage.setItem("userId", userID);
        if (roleId === 1) {
          navigate("/admin/user"); // Superadmin Redirect
        } else if (roleId === 2) {
          navigate("/admin/inventory"); // Admin Redirect
        } else if (roleId === 3) {
          navigate("/admin/delivery"); // Delivery Agent Redirect
        } else {
          navigate("/admin/loginadmin"); // Default Redirect if role is unknown
        }
      } else {
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      toast.error("Error logging in. Please check your network.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-[#f9f8f3] w-[320px] rounded-lg shadow-lg p-6">
        <h1 className="text-center text-lg font-semibold text-gray-800 mb-6">
          Welcome to Farm Greens Admin User
        </h1>

        <div>
          <label className="block text-sm text-gray-600 mb-1" htmlFor="mobile">
            Mobile Number
          </label>
          <input
            type="text"
            id="mobile"
            placeholder="Enter Your Mobile Number"
            value={mobileNumber}
            onChange={validatePhoneNumber}
            className="w-full px-4 py-2 border border-gray-400 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label
            className="block text-sm text-gray-600 mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="text"
            id="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-400 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500"
            required
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <button className="text-green-600 hover:underline">Cancel</button>
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
