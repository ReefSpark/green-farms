import { Routes, Route } from "react-router-dom";
import Login from "../components/Login";
import AddAddressForm from "../components/AddressForm";
import WelcomePage from "../components/WelcomePage";
import ProfilePage from "../components/ProfilePage";
import HomePage from "../components/HomePage";
import CartPage from "../components/CartPage";
import CartItems from "../components/CartItems";
import CheckoutPage from "../components/CheckoutPage";
import ProtectedRoute from "./ProtectedRountes";
import CheckoutSuccess from "../components/CheckoutSuccess";
import CheckoutFailure from "../components/checkoutFailure";
const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/addressform" element={<AddAddressForm />} />
        <Route path="/welcomepage" element={<WelcomePage />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/cartpage" element={<CartPage />} />
        <Route path="/cartitems" element={<CartItems />} />
        <Route path="/checkoutpage" element={<CheckoutPage />} />
        <Route path="/checkout-success/:id" element={<CheckoutSuccess />} />
        <Route path="/checkout-failure" element={<CheckoutFailure />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
