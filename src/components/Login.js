import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const navigate = useNavigate();

  function validatePhoneNumber(e) {
    const num = e.target.value;
    if (num.length > 10) {
      toast("mobile number should not be greater than 10 digits");
      return;
    }
    setMobileNumber(num);
  }

  const handleLogin = async () => {
    if (!mobileNumber) {
      toast("Please enter your mobile number");
      return;
    }
    if (mobileNumber.length !== 10) {
      toast("Mobile number must be exactly 10 digits!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile_no: mobileNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        const token1 = data?.data?.attributes?.token;
        const newUser = data?.data?.attributes?.message;

        if (!token1) {
          toast("Login failed: Token not received.");
          return;
        }

        localStorage.setItem("authToken", token1);
        localStorage.setItem("loggedInUser", mobileNumber);
        if (newUser === "new") {
          toast("Welcome new User");
          navigate("/user/addressform");
          return;
        }

        toast("Login successfull");
        navigate("/user/welcomepage");
      } else {
        toast(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast("An error occurred while logging in.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-[#f9f8f3] w-[320px] rounded-lg shadow-lg p-6">
        <h1 className="text-center text-lg font-semibold text-gray-800 mb-6">
          Welcome to Farm Greens!
        </h1>

        <div>
          <label className="block text-sm text-gray-600 mb-1" htmlFor="mobile">
            Mobile Number
          </label>
          <input
            type="number"
            id="mobile"
            placeholder="Enter Your Mobile Number"
            value={mobileNumber}
            onChange={validatePhoneNumber}
            className="w-full px-4 py-2 border border-gray-400 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500"
            required
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <button className="text-green-600 hover:underline">Cancel</button>
          <button
            onClick={handleLogin}
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
