import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminSideBar from "./AdminSideBar";

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editImage, setEditImage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newProduct, setNewProduct] = useState({
    product_name: "",
    product_type: "",
    price: "",
    discount: "",
    stock: "",
    description: "",
    is_out_of_stock: false,
    product_img: "",
  });
  const notify = () => toast("Product have been updated successfully");
  const deleteToast = () => toast("Product Deleted Successfully");
  const roleId = Number(localStorage.getItem("userRole"));

  async function fetchProducts() {
    try {
      const response = await fetch(
        "http://localhost:8000/api/admin/all-product"
      );
      const data = await response.json();
      const responseData = data?.data?.attributes?.data;
      if (response.ok) {
        setProducts(
          responseData?.map((item) => ({
            id: item._id,
            product_name: item.product_name,
            product_type: item.product_type,
            price: item.price,
            discount: item.discount,
            stock: item.stock,
            description: item.description,
            is_out_of_stock: item.is_out_of_stock,
            product_img: item.product_img,
          })) || []
        );
      } else {
        console.error("Failed to fetch products:", data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "product_name") {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        product_name: value || prevProduct.originalName,
      }));
    } else {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!newProduct.product_type || !newProduct.price || !newProduct.stock) {
      notify("Please fill in all required fields.");
      return;
    }

    try {
      const url = editProductId
        ? `http://localhost:8000/api/admin/edit-product/${editProductId}`
        : "http://localhost:8000/api/admin/add-product";

      const method = editProductId ? "PUT" : "POST";

      let requestBody = {};
      const existingProduct = products.find((p) => p.id === editProductId);

      if (editProductId && existingProduct) {
        Object.keys(newProduct).forEach((key) => {
          if (
            newProduct[key] !== existingProduct[key] &&
            newProduct[key] !== ""
          ) {
            requestBody[key] = newProduct[key];
          }
        });
      } else {
        requestBody = { ...newProduct };
      }

      // Ensure we're not sending product_name unless it's changed
      if (editProductId && !requestBody.product_name) {
        delete requestBody.product_name;
      }

      if (Object.keys(requestBody).length === 0) {
        notify("No changes detected.");
        return;
      }

      const formData = new FormData();
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      formData.append("data", JSON.stringify(requestBody));

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        notify(
          editProductId
            ? "Product updated successfully!"
            : "Product added successfully!"
        );
        fetchProducts();
        setIsFormVisible(false);
        setNewProduct({
          product_name: "",
          product_type: "",
          price: "",
          discount: "",
          stock: "",
          description: "",
          is_out_of_stock: false,
          product_img: "",
        });
        setEditProductId(null);
      } else {
        notify(data.message || "Operation failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileChange = async (e) => {
    setSelectedImage(e.target.files[0]);
    let file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await setEditImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    try {
      // eslint-disable-next-line no-restricted-globals
      if (confirm("Are you sure want to delete")) {
        const response = await fetch(
          `http://localhost:8000/api/admin/delete-product/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          deleteToast();
          fetchProducts();
        } else {
          deleteToast("Failed to delete");
        }
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = async (product) => {
    await setEditImage(product["product_img"]);
    setNewProduct(product);
    setEditProductId(product.id);
    setIsFormVisible(true);
  };
  const removeImage = async () => {
    await setSelectedImage(null);
    await setEditImage(null);
  };
  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <AdminSideBar />

        <main className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Inventory Management</h1>
            {roleId !== 3 && (
              <button
                className="m-2 p-2 bg-black text-white hover:bg-blue-600"
                onClick={() => {
                  setNewProduct({
                    product_name: "",
                    product_type: "",
                    price: "",
                    discount: "",
                    stock: "",
                    description: "",
                    is_out_of_stock: false,
                    product_img: "",
                  });
                  setEditProductId(null);
                  setIsFormVisible(true);
                }}
              >
                Add Product
              </button>
            )}
          </div>
          <div className="flex justify-end">
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2"
              required
            />
          </div>

          {isFormVisible && (
            <div className="p-4 border border-gray-300 bg-white shadow-md">
              <h2 className="text-lg font-semibold mb-2">
                {editProductId ? "Edit Product" : "Add New Product"}
              </h2>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Product Name"
                  name="product_name"
                  value={newProduct.product_name}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Product Type"
                  name="product_type"
                  value={newProduct.product_type}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  name="price"
                  value={newProduct.price}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                />
                <input
                  type="number"
                  placeholder="Discount"
                  name="discount"
                  value={newProduct.discount}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                />
                {/* <input
                  type="text"
                  placeholder="Product Image URL"
                  name="product_img"
                  value={newProduct.product_img}
                  onChange={handleChange}
                  className="border p-2 w-full"
                /> */}
                {newProduct.product_img && editImage != null ? (
                  <>
                    <img
                      // src={"/assets/grass.png"}
                      style={{ width: "10rem", height: "10rem" }}
                      src={editImage}
                      alt={newProduct.product_name}
                      className="w-8 h-8"
                    />
                    <div>
                      <button
                        className="p-2 bg-red-600 text-white rounded-lg ml-2 hover:bg-red-700"
                        onClick={() => removeImage()}
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <input type="file" onChange={handleFileChange} />
                )}
              </div>
              <div className="flex justify-end mt-2">
                <button
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  onClick={handleSubmit}
                >
                  {editProductId ? "Update" : "Submit"}
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
                  <th className="p-2 border">Product Name</th>
                  <th className="p-2 border">Product Type</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Stock</th>
                  <th className="p-2 border">Image</th>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="even:bg-gray-50">
                      <td className="p-2 border">{product.product_name}</td>
                      <td className="p-2 border">{product.product_type}</td>
                      <td className="p-2 border">{product.price}</td>
                      <td className="p-2 border">{product.stock}</td>
                      <td className="p-2 border">
                        <img
                          src={product.product_img}
                          alt={product.product_name}
                          className="w-8 h-8"
                        />
                      </td>
                      <td className="p-2 border">{product.description}</td>
                      {roleId !== 3 && (
                        <td className="p-2 border">
                          <button
                            className="text-blue-500"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-500 ml-2"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-2">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InventoryManagement;
