import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminSideBar = () => {
  const roleId = Number(localStorage.getItem("userRole"));
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/admin/loginadmin");
  };
  return (
    <aside className="w-64 bg-gray-300 p-4 flex flex-col h-screen justify-between md:min-h-[150vh] sm:min-h-[150vh] lg:min-h-[120vh] xl:min-h-[100vh]">
      <div>
        <img src="/assets/logo.png" alt="logo" className="mb-4" />

        <ul className="space-y-2">
          {/* User Management: Only accessible by roleId === 1 */}
          {roleId === 1 && (
            <li className="hover:bg-gray-200 p-2 rounded-lg cursor-pointer">
              <Link to="/admin/User">User Management</Link>
            </li>
          )}

          {/* Inventory & Delivery Management: Accessible by all roles */}
          {(roleId === 1 || roleId === 2 || roleId === 3) && (
            <>
              <li className="hover:bg-gray-200 p-2 rounded-lg cursor-pointer">
                <Link to="/admin/Inventory">Inventory Management</Link>
              </li>
              <li className="hover:bg-gray-200 p-2 rounded-lg cursor-pointer">
                <Link to="/admin/Delivery">Delivery Management</Link>
              </li>
            </>
          )}

          {/* Community Management: Accessible by roleId === 1 and roleId === 2 */}
          {(roleId === 1 || roleId === 2 || roleId === 3) && (
            <li className="hover:bg-gray-200 p-2 rounded-lg cursor-pointer">
              <Link to="/admin/Community">Community Management</Link>
            </li>
          )}
        </ul>
      </div>

      {/* User Info & Logout Button */}
      <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
        <div className="text-lg font-semibold mb-2">{userName}</div>
        <button
          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSideBar;
