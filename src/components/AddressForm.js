import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const AddAddressForm = () => {
  const [addressDetails, setAddressDetails] = useState({
    name: "",
    community_id: "",
    block: "",
    flat: "",
    pincode: "",
  });
  const [communities, setCommunities] = useState([]);
  const navigate = useNavigate();
  const notify = () => toast("Address Added Successfully");
  //console.log("getstatteee", communities);
  async function fetchCommunity() {
    try {
      const response = await fetch(
        "http://localhost:8000/api/admin/all-community"
      );
      const data = await response.json();
      const responseData = data?.data?.attributes?.data;
      // console.log("getadress", responseData);

      if (response.ok) {
        if (responseData.length > 0) {
          setCommunities(responseData);
        } else {
          setCommunities([]);
        }
      } else {
        console.error("Failed to fetch communities:", data.message);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  }

  useEffect(() => {
    fetchCommunity();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    // console.log(`Updating field: ${id}, Value: ${value}`);

    if (id === "community") {
      const selectedCommunity = communities.find((c) => c._id === value);
      setAddressDetails((prev) => ({
        ...prev,
        community_id: selectedCommunity ? selectedCommunity._id : "",
      }));
    } else {
      setAddressDetails((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !addressDetails.name ||
      !addressDetails.community_id ||
      !addressDetails.block ||
      !addressDetails.flat ||
      !addressDetails.pincode
    ) {
      notify("Please fill in all fields");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      notify("User not logged in.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/user/create-address",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            name: addressDetails.name,
            community_id: addressDetails.community_id,
            block: addressDetails.block,
            flat_door: addressDetails.flat,
            pincode: addressDetails.pincode,
          }),
        }
      );

      const data = await response.json();
      // console.log("address added", data);

      if (response.ok) {
        notify("Address saved successfully!");
        navigate("/user/welcomepage");
      } else {
        notify(data.message || "Failed to save address.");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      notify("An error occurred while saving the address.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Address
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={addressDetails.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="community"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select your community
            </label>
            <select
              id="community"
              value={addressDetails.community_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select your community</option>
              {communities.map((community) => (
                <option key={community._id} value={community._id}>
                  {community.community_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="block"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Block/Floor
            </label>
            <input
              type="text"
              id="block"
              placeholder="Ex: Block B"
              value={addressDetails.block}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="flat"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Flat/Door Number
            </label>
            <input
              type="text"
              id="flat"
              placeholder="Enter your flat number"
              value={addressDetails.flat}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="pincode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pincode
            </label>
            <input
              type="text"
              id="pincode"
              placeholder="Enter your pincode number"
              value={addressDetails.pincode}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={() => navigate("/user/login")}
              className="px-6 py-2 text-green-500 border border-green-500 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddressForm;
