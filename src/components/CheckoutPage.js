import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useFetchCart from "../customhooks/useFetchCart";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [addressDetails, setAddressDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAddress, setEditedAddress] = useState({});
  const [addressId, setAddressId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isloading, setRazporyLoading] = useState(false);
  const countItemSelector = useSelector((state) => state.cart.count);
  const cartItemSelector = useSelector((state) => state.cart.items);
  const addfetchCarts = useFetchCart();

  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  let total = cartItemSelector
    .reduce((total, item) => total + item.product_id?.price * item.qty, 0)
    .toFixed(2);

  async function fetchCartItems() {
    try {
      const response = await fetch("http://localhost:8000/api/user/cart", {
        method: "GET",
        headers: { Authorization: token },
      });

      const data = await response.json();
      const responseData = data?.data?.attributes?.data || [];

      const formattedCartItems = responseData.map((item) => ({
        id: item.product_id?._id,
        name: item.product_id?.product_name || "Unknown Item",
        price: item.product_id?.price || 0,
        qty: item.qty || 1,
        totalPrice: (item.product_id?.price || 0) * (item.qty || 1),
      }));

      if (response.ok) {
        setCartItems(formattedCartItems);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  }

  async function razorPayment() {
    try {
      const response = await fetch(
        `http://localhost:8000/api/user//razor_pay/payment/transaction_init`,
        {
          method: "POST",
          headers: { Authorization: token },
        }
      );

      const data = await response.json();
      const responseData = data?.data?.attributes;

      if (response.status == 200) {
        var options = {
          key: "rzp_test_Q8djboLBKNsDAp",
          amount: responseData.amount,
          currency: responseData.currency,
          name: "Farm Greens",
          description: "Payment",
          order_id: responseData.id,
          handler: async function (res) {
            let receipt = responseData.receipt;
            let getIndexOf = receipt.indexOf("#");
            let transId = receipt.substring(getIndexOf + 1, receipt.length);
            navigate(`/user/checkout-success/${transId}`);
          },
          modal: {
            // We should prevent closing of the form when esc key is pressed.
            escape: false,
          },
          prefill: {
            name: localStorage["name"] ? localStorage["name"] : "greenfarms",
            email: localStorage["email"]
              ? localStorage["email"]
              : "greenfarms@gmail.com",
          },
          notes: {
            receipt: responseData.receipt,
          },
          theme: {
            color: "#3399cc",
          },
        };
        options.modal.ondismiss = () => {
          if (errorMsg) {
            navigate(`/user/checkout-failure`);
          }
        };
        var rzp1 = new window.Razorpay(options);
        var that = this;
        rzp1.on("payment.failed", async (response) => {
          await that.setErrorMsg(response.error.description);
          // that.message.setRazorPayErr('')
          // that.errorMsg=response.error.description;
          // console.log("Response:",response)
          // that.message.setRazorPayErr(that.errorMsg)
        });
        rzp1.open();
        setRazporyLoading(false);
      } else {
        toast(data?.data?.attributes?.message || "Invalid request.");
      }
    } catch (error) {
      toast("Invalid request.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchProfile() {
    try {
      const response = await fetch(
        `http://localhost:8000/api/user/profile/${userId}`,
        {
          method: "GET",
          headers: { Authorization: token },
        }
      );

      const data = await response.json();
      const responseData = data?.data?.attributes?.data;

      if (response.ok && responseData?.address_details) {
        const address = {
          name: responseData.address_details.name || "",
          community_id: responseData.address_details.community_id || "",
          block: responseData.address_details.block || "",
          flat_door: responseData.address_details.flat_door || "",
          pincode: responseData.address_details.pincode || "",
        };
        setAddressDetails(address);
        setEditedAddress(address);
        setAddressId(responseData.address_details._id);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function editAddress() {
    try {
      const response = await fetch(
        `http://localhost:8000/api/user/edit-address/${addressId}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedAddress),
        }
      );

      if (response.ok) {
        toast("Address updated successfully!");
        setAddressDetails(editedAddress);
        setIsEditing(false);
        fetchProfile();
      } else {
        toast("Failed to update address.");
      }
    } catch (error) {
      console.error("Error updating address:", error);
    }
  }

  useEffect(() => {
    addfetchCarts();
    fetchCartItems();
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/user/cartPage")}
          className="flex items-center space-x-2"
        >
          <i className="fa-solid fa-arrow-left font-bold"></i>
        </button>
        <h1 className="text-xl font-bold">Checkout</h1>
        <div></div>
      </header>

      <div className=" bg-orange-100 p-4 rounded-lg shadow-sm mb-4">
        {loading ? (
          <p>Loading cart items...</p>
        ) : cartItemSelector?.length === 0 ? (
          <p className="text-gray-500 text-center">No items in cart.</p>
        ) : (
          cartItemSelector.slice(0, 1).map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 mb-4 border-b pb-4 last:border-0"
            >
              <img
                src={item?.product_id?.product_img}
                alt={item.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold">{countItemSelector} Items</p>
              </div>
              <br />
              <button
                className="text-blue-500"
                onClick={() => navigate("/user/cartpage")}
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>

      <div className="bg-orange-100 p-4 rounded-lg shadow-sm mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Delivery to</h3>
        {loading ? (
          <p>Loading address...</p>
        ) : isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editedAddress.name}
              onChange={(e) =>
                setEditedAddress({ ...editedAddress, name: e.target.value })
              }
              className="border rounded p-2 w-full"
              placeholder="Name"
              required
            />
            <input
              type="text"
              value={editedAddress.block}
              onChange={(e) =>
                setEditedAddress({ ...editedAddress, block: e.target.value })
              }
              className="border rounded p-2 w-full"
              placeholder="Block"
            />
            <input
              type="text"
              value={editedAddress.flat_door}
              onChange={(e) =>
                setEditedAddress({
                  ...editedAddress,
                  flat_door: e.target.value,
                })
              }
              className="border rounded p-2 w-full"
              placeholder="Flat/Door No."
              required
            />
            <input
              type="text"
              value={editedAddress.pincode}
              onChange={(e) =>
                setEditedAddress({ ...editedAddress, pincode: e.target.value })
              }
              className="border rounded p-2 w-full"
              placeholder="Pincode"
              required
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={editAddress}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : addressDetails ? (
          <p className="text-gray-500">
            {addressDetails.name}, {addressDetails.block},{" "}
            {addressDetails.flat_door}, {addressDetails.pincode}
          </p>
        ) : (
          <p className="text-gray-500">
            No address found. Please update your profile.
          </p>
        )}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 mt-2"
          >
            Change
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-bold mb-4">Payment methods</h3>
        {[
          { method: "Pay Via UPI", icon: "/assets/upi_pay.png" },
          { method: "Scan QR", icon: "/assets/qr_code.png" },
          { method: "Debit/Credit Card", icon: "/assets/credit_card.png" },
          // {
          //   method: "Cash on Delivery",
          //   icon: "/assets/account_balance_wallet.png",
          // },
        ].map((payment, index) => (
          <button
            key={index}
            onClick={() => razorPayment()}
            className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-2 shadow-sm w-full"
          >
            {isloading ? (
              "Processing..."
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <img
                    src={payment.icon}
                    alt={payment.method}
                    className="h-6 w-6"
                  />
                  <span>{payment.method}</span>
                </div>
                <span>₹{total}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CheckoutPage;
