import React from "react";

const EditProduct = () => {
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Add/Edit Product</h1>
        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-sm mb-1">
                Product Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Product Name"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-sm mb-1">Price</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Price"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-sm mb-1">
                  Discount Price
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Discount Price"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-sm mb-1">
                Description
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description"
                rows={4}
              ></textarea>
            </div>
            <div>
              <label className="block font-medium text-sm mb-1">
                Upload Image
              </label>
              <input
                type="file"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <button className="w-full bg-blue-500 text-white hover:bg-blue-600">
                Save Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
