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
    setShops([]);

    try {
      const res = await fetch(
        `${BASE_URL}/api/shops?category=${category.value}`
      );
      const data = await res.json();
      setShops(data);
    } catch (err) {
      console.error(err);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* HEADER */}
      <div className="px-6 py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Explore Categories
        </h1>
        <p className="text-gray-400 mt-2">
          Discover local businesses by what they offer
        </p>
      </div>

      {/* CATEGORY BAR */}
      <div className="px-4 pb-6">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-3">

          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;

            return (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full
                  border transition-all duration-200 text-sm
                  hover:scale-105 active:scale-95
                  ${
                    isActive
                      ? "bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/20"
                      : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                  }
                `}
              >
                <span className="text-base">{cat.icon}</span>
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">

          {/* EMPTY STATE */}
          {!searched && (
            <div className="text-center mt-20 text-gray-500">
              <p className="text-lg">Pick a category to start exploring</p>
              <p className="text-sm mt-1">Find shops, services, and more</p>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 rounded-2xl bg-gray-800 animate-pulse"
                />
              ))}
            </div>
          )}

          {!loading && searched && shops.length === 0 && (
            <div className="text-center mt-16 text-red-400">
              No shops found in{" "}
              <span className="capitalize font-semibold">
                {selectedCategory}
              </span>
            </div>
          )}

          {!loading && shops.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-6 mt-10">
                <h2 className="text-lg font-semibold">
                  {shops.length} result{shops.length > 1 ? "s" : ""}
                </h2>

                <span className="text-sm text-gray-400 capitalize">
                  {selectedCategory}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                {shops.map((shop) => (
                  <div
                    key={shop.id}
                    onClick={() => navigate(`/shops/${shop.id}`)}
                    className="
                      group cursor-pointer bg-gray-900 rounded-2xl overflow-hidden
                      border border-gray-800 hover:border-yellow-400/40
                      transition-all duration-300 hover:-translate-y-1
                      hover:shadow-xl hover:shadow-black/40
                    "
                  >
                    <div className="h-32 bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-400" />

                    <div className="p-5">
                      <h3 className="text-lg font-bold group-hover:text-yellow-300 transition">
                        {shop.name}
                      </h3>

                      <p className="text-sm text-gray-400 capitalize mt-1">
                        {shop.category}
                      </p>

                      <div className="mt-4 text-xs text-gray-500 group-hover:text-gray-300 transition">
                        Click to view details →
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}