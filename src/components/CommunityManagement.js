import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminSideBar from "./AdminSideBar";

const CommunityManagement = () => {
  const [communities, setCommunities] = useState([]);
  const [editCommunity, setEditCommunity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const notify = () => toast("Product added successfully");
  const deleteToast = () => toast("Product Deleted Successfully");
  const roleId = Number(localStorage.getItem("userRole"));

  async function fetchCommunity() {
    try {
      const response = await fetch(
        "http://localhost:8000/api/admin/all-community"
      );
      const data = await response.json();
      const responseData = data?.data?.attributes?.data;
      if (response.ok) {
        if (responseData.length > 0) {
          updateProducts(responseData);
        } else {
          setCommunities([]);
        }
        //console.log("All product data:", data);
      } else {
        console.error("Failed to fetch products:", data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    fetchCommunity();
  }, []);

  function updateProducts(productList) {
    const formattedProducts = productList.map((item) => ({
      id: item._id,
      community_name: item.community_name,
      community_occurence: item.community_occurence,
      community_no: item.community_no,
      community_block: item.community_block,
      area: item.area,
      location: item.location,
    }));
    setCommunities(formattedProducts);
  }

  const [newCommunity, setNewCommunity] = useState({
    community_name: "",
    community_occurence: "",
    community_no: "",
    community_block: "",
    area: "",
    location: "",
  });

  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleChange = (e) => {
    setNewCommunity({ ...newCommunity, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      !newCommunity.community_name ||
      !newCommunity.community_occurence ||
      !newCommunity.community_no
    ) {
      notify("Please fill in all required fields.");
      return;
    }

    let requestBody = {};
    if (editCommunity) {
      requestBody = Object.keys(newCommunity).reduce((acc, key) => {
        if (newCommunity[key] !== editCommunity[key]) {
          acc[key] = newCommunity[key];
        }
        return acc;
      }, {});

      if (Object.keys(requestBody).length === 0) {
        notify("No changes detected.");
        return;
      }
    } else {
      requestBody = { ...newCommunity };
    }

    const url = editCommunity
      ? `http://localhost:8000/api/admin/edit-community/${editCommunity.id}`
      : "http://localhost:8000/api/admin/add-community";

    const method = "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        notify(
          editCommunity
            ? "Community updated successfully!"
            : "Community added successfully!"
        );
        fetchCommunity();
        setNewCommunity({
          community_name: "",
          community_occurence: "",
          community_no: "",
          community_block: "",
          area: "",
          location: "",
        });
        setIsFormVisible(false);
        setEditCommunity(null);
      } else {
        notify(data.data?.attributes?.message?.message || "Operation failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = (id) => {
    async function deleteProduct() {
      try {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Are you sure want to delete ?")) {
          const response = await fetch(
            `http://localhost:8000/api/admin/delete-community/${id}`,
            {
              method: "DELETE",
            }
          );
          if (response.ok) {
            deleteToast("Deleted sucessfully");
            fetchCommunity();
          } else {
            deleteToast("failed to delete");
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    deleteProduct();
  };

  const handleEditClick = (community) => {
    setEditCommunity(community);
    setNewCommunity(community);
    setIsFormVisible(true);
  };

  const filteredCommunities = communities.filter((community) =>
    community.community_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <AdminSideBar />
        <main className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Community Management</h1>
            {roleId !== 3 && (
              <button
                className="m-2 p-2 bg-black text-white hover:bg-blue-600"
                onClick={() => setIsFormVisible(true)}
              >
                Add Community
              </button>
            )}
          </div>
          <div className=" flex justify-end">
            <input
              type="text"
              placeholder="Search by Community Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2"
              style={{width:'250px'}}
              required
            />
          </div>

          {isFormVisible && (
            <div className="p-4 border border-gray-300 bg-white shadow-md">
              <h2 className="text-lg font-semibold mb-2">Add New Community</h2>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Community Name"
                  name="community_name"
                  value={newCommunity.community_name}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Occurrence"
                  name="community_occurence"
                  value={newCommunity.community_occurence}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Community No"
                  name="community_no"
                  value={newCommunity.community_no}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                />
                <input
                  type="text"
                  placeholder="Community Block"
                  name="community_block"
                  value={newCommunity.community_block}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Area"
                  name="area"
                  value={newCommunity.area}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  name="location"
                  value={newCommunity.location}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="flex justify-end mt-2">
                <button
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
                <button
                  className="p-2 bg-red-600 text-white rounded-lg ml-2 hover:bg-red-700"
                  onClick={() => setIsFormVisible(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="overflow-auto mt-4">
            <table className="w-full border border-gray-200">
              <thead className="bg-purple-400">
                <tr>
                  <th className="p-2 border border-gray-200">Community Name</th>
                  <th className="p-2 border border-gray-200">Occurrence</th>
                  <th className="p-2 border border-gray-200">Community No</th>
                  <th className="p-2 border border-gray-200">
                    Community Block
                  </th>
                  <th className="p-2 border border-gray-200">Area</th>
                  <th className="p-2 border border-gray-200">Location</th>
                  <th className="p-2 border border-gray-200">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommunities.map((community) => (
                  <tr key={community.id} className="even:bg-gray-50">
                    <td className="p-2 border border-gray-200">
                      {community.community_name}
                    </td>
                    <td className="p-2 border border-gray-200">
                      {community.community_occurence}
                    </td>
                    <td className="p-2 border border-gray-200">
                      {community.community_no}
                    </td>
                    <td className="p-2 border border-gray-200">
                      {community.community_block}
                    </td>
                    <td className="p-2 border border-gray-200">
                      {community.area}
                    </td>
                    <td className="p-2 border border-gray-200">
                      {community.location}
                    </td>
                    {roleId !== 3 && (
                      <td className="p-2 border border-gray-200">
                        <button
                          className="text-blue-500"
                          onClick={() => handleEditClick(community)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 ml-2"
                          onClick={() => handleDelete(community.id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CommunityManagement;
