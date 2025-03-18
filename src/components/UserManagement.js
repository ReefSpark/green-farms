import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSideBar from "./AdminSideBar";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    mobile_no: "",
    password: "",
    is_active: true,
  });
  const navigate = useNavigate();

  const fetchUsers = async (type) => {
    setLoading(true);
    const apiUrl =
      type === "1"
        ? "http://localhost:8000/api/admin/admin-users-list"
        : "http://localhost:8000/api/admin/admin-delivery-list";

    try {
      const response = await axios.get(apiUrl);
      const userData = response?.data?.data?.attributes?.data || [];
      setUsers(userData);
      setFilteredUsers(userData);
    } catch (error) {
      console.error(`Error fetching ${type} users:`, error);
    } finally {
      setLoading(false);
    }
  };
  const handleNavigation = () => {
    navigate();
  };

  useEffect(() => {
    fetchUsers(userType);
  }, [userType]);

  const handleDelete = (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure want to delete ?")) {
      setUsers(users.filter((user) => user._id !== id));
      setFilteredUsers(filteredUsers.filter((user) => user._id !== id));
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((user) => user.username.toLowerCase().includes(query))
      );
    }
  };
  const handleButtonClick = () => {
    setSearchQuery(""); // Clear search query
    setFilteredUsers(users); // Reset user list
  };
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      username: user.username,
      mobile_no: user.mobile_no,
      password: user.password,
      is_active: user.is_active,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const updatedFields = Object.fromEntries(
      Object.entries(editFormData).filter(
        ([key, value]) => value !== editingUser[key]
      )
    );
    if (updatedFields.mobile_no && updatedFields.mobile_no.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits!");
      return;
    }
    if (Object.keys(updatedFields).length === 0) {
      toast("No changes detected.");
      return;
    }

    const apiUrl =
      userType === "1"
        ? `http://localhost:8000/api/admin/edit-user/${editingUser._id}`
        : `http://localhost:8000/api/admin/edit-delivery/${editingUser._id}`;

    try {
      await axios.post(apiUrl, updatedFields);
      toast("User updated successfully!");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editingUser._id ? { ...user, ...updatedFields } : user
        )
      );

      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editingUser._id ? { ...user, ...updatedFields } : user
        )
      );

      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      toast(error.response?.data?.message || "Failed to update user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <AdminSideBar />

        <main className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">User Management</h1>
            <div className="space-x-2">
              <button
                className="m-2 p-2 bg-gray-600 text-white hover:bg-gray-700"
                onClick={() => setShowPasswords((prev) => !prev)}
              >
                {showPasswords ? "Hide Passwords" : "Show Passwords"}
              </button>
              <Link
                to="/admin/adduser"
                state={{ userType }}
                className="m-2 p-2 bg-black text-white hover:bg-blue-600"
              >
                {userType === "1" ? "Add User" : "Add Agent"}
              </Link>
            </div>
          </div>

          <div className="space-x-2">
            <button
              className={`m-2 p-2 ${
                userType === "1" ? "bg-blue-600 text-white" : "bg-gray-300"
              } hover:bg-blue-700`}
              onClick={() => {
                handleButtonClick();
                setUserType("1");
              }}
            >
              Get Admin Users
            </button>
            <button
              className={`m-2 p-2 ${
                userType === "2" ? "bg-blue-600 text-white" : "bg-gray-300"
              } hover:bg-blue-700`}
              onClick={() => {
                handleButtonClick();
                setUserType("2");
              }}
            >
              Get Delivery Users
            </button>
          </div>
          <div className="flex justify-end mb-2">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearch}
              className="border p-2"
              required
            />
          </div>

          <div className="overflow-auto">
            {loading ? (
              <p>Loading users...</p>
            ) : filteredUsers.length > 0 ? (
              <table className="w-full border border-gray-200">
                <thead className="bg-purple-400">
                  <tr>
                    <th className="p-2 border border-gray-200">
                      {userType === "1" ? "User Name" : "Agent Name"}
                    </th>
                    <th className="p-2 border border-gray-200">
                      {userType === "1" ? "User ID" : "Agent ID"}
                    </th>
                    <th className="p-2 border border-gray-200">Phone Number</th>
                    <th className="p-2 border border-gray-200">Password</th>
                    <th className="p-2 border border-gray-200">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="even:bg-gray-50">
                      <td className="p-2 border border-gray-200">
                        {user.username}
                      </td>
                      <td className="p-2 border border-gray-200">{user._id}</td>
                      <td className="p-2 border border-gray-200">
                        {user.mobile_no}
                      </td>
                      <td className="p-2 border border-gray-200">
                        {showPasswords ? user.password : "*******"}
                      </td>
                      <td className="p-2 border border-gray-200">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-500"
                            onClick={() => handleEditClick(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-500"
                            onClick={() => handleDelete(user._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No users found</p>
            )}
          </div>
        </main>
      </div>
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="username"
                value={editFormData.username}
                onChange={handleEditChange}
                className="border p-2 w-full mb-2"
                required
              />
              <input
                type="text"
                name="mobile_no"
                value={editFormData.mobile_no}
                onChange={handleEditChange}
                className="border p-2 w-full mb-2"
                required
              />
              <div className="flex justify-between ">
                <button
                  className="text-red-500 mt-2 "
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white p-2">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
