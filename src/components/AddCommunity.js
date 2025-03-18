const AddCommunity = () => {
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Add/Edit Community</h1>
        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-sm mb-1">
                Community Name
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
                <label className="block font-medium text-sm mb-1">
                  Occurrence
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Price"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-sm mb-1">
                  Assign Delivery Person
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Discount Price"
                  required
                />
              </div>
            </div>
            <div>
              <button className="w-full bg-blue-500 text-white hover:bg-blue-600">
                select date
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCommunity;
