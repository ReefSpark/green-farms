import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AdminSideBar from "./AdminSideBar";
import { toast } from "react-toastify";

const DeliveryManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [ordersCount, setOrdersCount] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryId, setDeliveryId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [deliveryAgents, setDeliveryAgents] = useState([]);
  const storedRoleId = Number(localStorage.getItem("userRole"));
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [status, setStatus] = useState("");

  console.log("orders", orders);
  async function fetchOrders() {
    try {
      const response = await fetch(
        "http://localhost:8000/api/admin/list/orders"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data?.data?.attributes?.data || []);
      const filteredByUserId = data?.data?.attributes?.data.filter((item) => {
        const storedUserId = localStorage.getItem("userId");
        const storedRoleId = Number(localStorage.getItem("userRole"));
        return storedRoleId === 3
          ? item?.delivery_id?._id === storedUserId
          : true;
      });
      console.log("9000000000", filteredByUserId);
      setFilteredOrders(filteredByUserId);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCountOrder() {
    try {
      const response = await fetch(
        "http://localhost:8000/api/admin/list/orders/count"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrdersCount(data?.data?.attributes || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredOrders.map((order) => ({
        "Community Name": order?.community_id?.community_name || "N/A",
        "Product Details":
          order?.product_id
            ?.map(
              (product, index) =>
                `${order.qty?.[index]} * ${product.product_name}`
            )
            .join(", ") || "No Products",
        "Payment Status": order?.payment_status || "N/A",
        "Delivery Agent": order?.delivery_id?.username || "-",
        "Delivery Date": order?.delivery_date || "N/A",
        "Delivery S tatus": order?.delivery_status || "N/A",
        "Customer Mobile": order?.user_id?.mobile_no || "N/A",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "Orders.xlsx");
  };

  useEffect(() => {
    fetchCountOrder();
    fetchOrders();
    fetchDeliveryAgents();
  }, []);

  const openModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };
  const openModelAgent = (orderId) => {
    setSelectedOrder(orderId);
    setIsModalOpened(true);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };
  const fetchDeliveryAgents = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/admin/admin-delivery-list"
      );
      const data = await response.json();
      const responseData = data?.data?.attributes?.data;

      if (response.ok) {
        setDeliveryAgents(responseData);
      } else {
        toast(data?.data?.attributes?.message);
        console.error("Invalid API response", data?.data?.attributes?.message);
      }
    } catch (error) {
      console.error("Error fetching delivery agents:", error);
    }
  };

  const handleAssignAgent = async () => {
    if (!deliveryId || !deliveryDate) {
      toast("Please enter Delivery ID and Date");
      return;
    }
    const formattedDate = formatDate(deliveryDate);

    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/assign/order/${selectedOrderId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            delivery_id: deliveryId,
            delivery_date: formattedDate,
          }),
        }
      );
      const data = await response.json();
      const getError = toast(data?.data?.attributes?.message);

      if (!response.ok) throw new Error(getError);

      setIsModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleUpdateStatus = async () => {
    if (!status) {
      toast("Please enter status");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/update/status/${selectedOrder}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();
      toast(data?.data?.attributes?.message || "Status updated successfully!");
      setStatus("");
      setIsModalOpened(false);
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const orderById = filteredOrders.filter((order) => {
    return order?.community_id?.community_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
  });
  console.log("orderById", orderById);

  return (
    <div className="flex  bg-gray-100 min-h-[120vh]">
      <AdminSideBar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Delivery Management</h1>

        <div className="flex justify-end mt-4 space-x-4">
          <button
            className="bg-green-300 px-4 py-2 rounded"
            onClick={exportToExcel}
          >
            Export to Excel
          </button>
        </div>
        <div>
          {ordersCount && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="p-4 border rounded-lg font-bold">
                <span className="font-bold">Total Orders:</span>
                <span className="font-normal"> {ordersCount.total_order}</span>
              </div>
              <div className="p-4 border rounded-lg font-bold">
                <span className="font-bold">₹ Order Price:</span>
                <span className="font-normal"> {ordersCount.order_price}</span>
              </div>
              <div className="p-4 border rounded-lg font-bold">
                <span className="font-bold">Cancelled Orders:</span>
                <span className="font-normal"> {ordersCount.cancel_count}</span>
              </div>
              <div className="p-4 border rounded-lg font-bold">
                <span className="font-bold">Least Order Community:</span>
                <span className="font-normal">
                  {" "}
                  {ordersCount.leat_community}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <input
            type="text"
            placeholder="Search by community"
            className="border px-4 py-2 rounded w-full md:w-1/2"
            onChange={(e) => setSearchTerm(e.target.value)}
            required
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-600 mt-4">Loading orders...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-4">{error}</p>
        ) : (
          <div className="mt-4 bg-white p-4 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Community Name</th>
                  <th className="p-2 border">Product Details</th>
                  <th className="p-2 border">Payment Status</th>
                  <th className="p-2 border">Delivery Agent</th>
                  <th className="p-2 border">Delivery Date</th>
                  <th className="p-2 border">Customer Mobile</th>
                  <th className="p-2 border">Delivery Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orderById.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                      No Data Available
                    </td>
                  </tr>
                ) : (
                  orderById.map((order) => (
                    <tr key={order._id} className="text-center">
                      <td className="p-2 border">
                        {order?.community_id?.community_name || "N/A"}
                      </td>
                      <td className="p-2 border">
                        {order?.product_id?.map((product, index) => (
                          <div key={product._id}>
                            {order.qty?.[index]} * {product.product_name}
                          </div>
                        ))}
                      </td>
                      <td className="p-2 border text-green-600">
                        {order?.payment_status}
                      </td>
                      <td className="p-2 border">
                        {order?.delivery_id?.username || "-"}
                      </td>
                      <td className="p-2 border">{order.delivery_date}</td>
                      <td className="p-2 border">
                        {order?.user_id?.mobile_no || "N/A"}
                      </td>
                      <td className="p-2 border">
                        {order?.delivery_status || "-"}
                      </td>
                      <td className="p-2 border ">
                        {(storedRoleId === 1 || storedRoleId === 2) &&
                        !order?.delivery_id?.username &&
                        order?.delivery_status !== "Cancelled" &&
                        order?.delivery_status !== "Delivered" ? (
                          <button
                            onClick={() => openModal(order._id)}
                            className="bg-green-500 text-white px-2 py-1 rounded"
                          >
                            Assign Agent
                          </button>
                        ) : (
                          storedRoleId === 1 &&
                          order?.delivery_id?.username &&
                          order?.delivery_status !== "Cancelled" &&
                          order?.delivery_status !== "Delivered" && (
                            <button
                              onClick={() => openModal(order._id)}
                              className="bg-blue-500 text-white px-2 py-1 rounded"
                            >
                              Edit Agent
                            </button>
                          )
                        )}
                        {storedRoleId === 3 ? (
                          <>
                            {order?.delivery_status !== "Cancelled" &&
                              order?.delivery_status !== "Delivered" && (
                                <button
                                  onClick={() => openModelAgent(order._id)}
                                  className="bg-blue-500 text-white px-2 py-1 rounded"
                                >
                                  Update Status
                                </button>
                              )}
                          </>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                Edit Assign Delivery Agent
              </h2>
              <select
                value={deliveryId}
                onChange={(e) => setDeliveryId(e.target.value)}
                className="border p-2 rounded w-full mb-4"
              >
                <option value="">-- Select Delivery Agent --</option>
                {deliveryAgents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.username}
                  </option>
                ))}
              </select>

              <label className="block mb-2">Delivery Date:</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="border p-2 rounded w-full mb-4"
                required
              />

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                {storedRoleId === 2 || storedRoleId === 1 ? (
                  <button
                    onClick={handleAssignAgent}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Assign
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        )}
        {isModalOpened && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                Update Delivery Status
              </h2>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border p-2 rounded w-full mb-4"
              >
                <option value="">-- Select Status --</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Delivered">Delivered</option>
              </select>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpened(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus(orders.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryManagement;
