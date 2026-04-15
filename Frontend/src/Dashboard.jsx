import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

const handleDeleteShop = async (shopId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/shops/${shopId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      setShops((prev) => prev.filter((s) => s.id !== shopId));
    } else {
      console.error(data.message);
    }
  } catch (err) {
    console.error(err);
  }
};

const CATEGORIES = [
  { label: "Food & Drinks", value: "food" },
  { label: "Retail", value: "retail" },
  { label: "Services", value: "services" },
  { label: "Health & Beauty", value: "health" },
  { label: "Electronics", value: "electronics" },
  { label: "Clothing", value: "clothing" },
  { label: "Bakery", value: "bakery" },
  { label: "Grocery", value: "grocery" },
  { label: "Hardware", value: "hardware" },
  { label: "Education", value: "education" },
  { label: "Laundry", value: "laundry" },
  { label: "Printing", value: "printing" },
];

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [shops, setShops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [shopName, setShopName] = useState("");
  const [shopCategory, setShopCategory] = useState("");
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);
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

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome back, {username}
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your shops and track your progress
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Your Shops</h2>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Create Shop
          </button>
        </div>

        {shops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="p-5 bg-gray-50 rounded-xl border hover:shadow-lg cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{shop.name}</h3>
                    <p className="text-gray-500 text-sm">{shop.category}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteShop(shop.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">
            You don't have any shops yet.
          </p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

            <h2 className="text-2xl font-bold mb-6">Create New Shop</h2>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Shop Name"
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <button
              onClick={() => setShowCategoryPanel(true)}
              className="w-full border rounded-lg px-4 py-2 text-left mb-4"
            >
              {shopCategory ? `Category: ${shopCategory}` : "Select Category"}
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateShop}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white rounded-lg"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>

          </div>
        </div>
      )}

      {showCategoryPanel && (
        <div className="fixed inset-0 bg-black/40 flex z-50">

          <div className="w-80 bg-white h-full p-4 shadow-xl">

            <div className="flex justify-between mb-4">
              <h2 className="font-bold">Select Category</h2>
              <button onClick={() => setShowCategoryPanel(false)}>✕</button>
            </div>

            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setShopCategory(cat.value);
                    setShowCategoryPanel(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg"
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>

          <div
            className="flex-1"
            onClick={() => setShowCategoryPanel(false)}
          />

        </div>
      )}

    </div>
  );
}