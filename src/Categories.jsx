import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

const CATEGORIES = [
  { label: "Food & Drinks", icon: "🍽️☕", value: "food" },
  { label: "Retail", icon: "🛍️", value: "retail" },
  { label: "Services", icon: "🛠️", value: "services" },
  { label: "Health & Beauty", icon: "💆‍♀️", value: "health" },
  { label: "Electronics", icon: "📱", value: "electronics" },
  { label: "Clothing", icon: "👕", value: "clothing" },
  { label: "Bakery", icon: "🍞🥐", value: "bakery" },
  { label: "Grocery", icon: "🛒🥦", value: "grocery" },
  { label: "Hardware", icon: "🔧🪛", value: "hardware" },
  { label: "Education", icon: "📚", value: "education" },
  { label: "Laundry", icon: "👕🧺", value: "laundry" },
  { label: "Printing", icon: "🖨️📄", value: "printing" },
];

export default function Categories() {
  const [shops, setShops] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category.value);
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(
        `${BASE_URL}/api/shops?category=${category.value}`
      );
      const data = await res.json();
      setShops(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Browse Categories here</h1>
        <p className="text-gray-500 mt-2">
          Select a category to find shops that match your choice
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryClick(cat)}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition duration-200 cursor-pointer
              ${
                selectedCategory === cat.value
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:shadow-md"
              }`}
          >
            <span className="text-3xl">{cat.icon}</span>
            <span className="text-sm font-medium text-center">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        {!searched && (
          <p className="text-center text-gray-400 py-10">
            Select a category above to see shops
          </p>
        )}

        {loading && (
          <p className="text-center text-gray-500 py-10 animate-pulse">
            Loading shops...
          </p>
        )}

        {!loading && searched && shops.length === 0 && (
          <p className="text-center text-red-400 py-10">
            No shops found for "{selectedCategory}"
          </p>
        )}

        {!loading && shops.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {shops.length} shop{shops.length > 1 ? "s" : ""} found in{" "}
              <span className="text-blue-600 capitalize">{selectedCategory}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  onClick={() => navigate(`/shops/${shop.id}`)}
                  className="p-5 bg-gray-50 rounded-xl border hover:shadow-lg hover:-translate-y-1 transition duration-300 cursor-pointer"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {shop.name}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {shop.category}
                  </p>
                  <div className="mt-4 text-blue-600 text-sm font-medium">
                    View Details →
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}