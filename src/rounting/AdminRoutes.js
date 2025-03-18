import { Routes, Route } from "react-router-dom";
import AdminLogin from "../components/AdminLogin";
import CreateAdminUser from "../components/CreateAdminUser";
import InventoryManagement from "../components/InventoryManagement";
import UserManagement from "../components/UserManagement";
import CommunityManagement from "../components/CommunityManagement";
import DeliveryManagement from "../components/DeliveryManagement";
import EditProduct from "../components/EditProduct";
import AddUser from "../components/AddUser";
import AddCommunity from "../components/AddCommunity";
import ProtectedRoute from "./ProtectedRountes";
import UnauthorizedPage from "./UnauthorizedPage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/loginadmin" element={<AdminLogin />} />
      <Route path="/create" element={<CreateAdminUser />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/user" element={<UserManagement />} />
        <Route path="/editpanel" element={<EditProduct />} />
        <Route path="/adduser" element={<AddUser />} />
        <Route element={<ProtectedRoute allowedRoles={[1, 2]} />}>
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/community" element={<CommunityManagement />} />
          <Route path="/addcommunity" element={<AddCommunity />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[3]} />}>
          <Route path="/delivery" element={<DeliveryManagement />} />
        </Route>
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
    </Routes>
  );
};

export default AdminRoutes;
