import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [shops, setShops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [shopName, setShopName] = useState("");
  const [shopCategory, setShopCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetch(`${BASE_URL}/api/shops/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username || "");
        setShops(data.shops || []);
      })
      .catch((err) => console.error(err));
  }, [userId, navigate]);

  const handleCreateShop = async () => {
    if (!shopName || !shopCategory) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/shops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          name: shopName,
          category: shopCategory,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShops((prev) => [...prev, data.shop]);
        setShowModal(false);
        setShopName("");
        setShopCategory("");
      } else {
        setError(data.message || "Failed to create shop.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome back to your account, {username}
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your shops and track your progress
        </p>
      </div>

      {/* Shops Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Your Shops</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Create Shop
          </button>
        </div>

        {shops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="p-5 bg-gray-50 rounded-xl border hover:shadow-lg hover:-translate-y-1 transition duration-300 cursor-pointer"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {shop.name}
                </h3>
                <p className="text-gray-500 text-sm">{shop.category}</p>
                <div className="mt-4 text-blue-600 text-sm font-medium">
                  View Details →
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">You don't have any shops yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create your first shop
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Create New Shop
            </h2>

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. My Bakery"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={shopCategory}
                onChange={(e) => setShopCategory(e.target.value)}
                placeholder="e.g. Food, Retail, Services"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setError("");
                  setShopName("");
                  setShopCategory("");
                }}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateShop}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Shop"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}