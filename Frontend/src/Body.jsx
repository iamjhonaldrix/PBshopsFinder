import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

function Body() {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [category, setCategory] = useState("");
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!input.trim()) return;

    setCategory(input.trim());
    setLoading(true);
    setShops([]);

    try {
      const res = await fetch(
        `${BASE_URL}/api/shops?category=${input.trim()}`
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">

      <div className="px-6 py-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Discover Local Businesses
        </h1>

        <p className="text-gray-400 mt-3">
          Search shops, explore categories, and find products near you
        </p>

        <div className="mt-6 flex justify-center">
          <div className="flex w-full max-w-2xl gap-3">

            <input
              type="text"
              placeholder="Search category..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-5 py-3 rounded-xl bg-white text-black outline-none"
            />

            <button
              onClick={handleSearch}
              className="bg-yellow-400 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition"
            >
              Search
            </button>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 px-6 pb-10">

        <div className="col-span-12 md:col-span-5 lg:col-span-4 space-y-4">

          <div className="bg-gray-900 rounded-2xl p-5">
            <h2 className="text-lg font-bold mb-2">Search Results</h2>

            {loading && (
              <p className="text-yellow-300">Loading...</p>
            )}

            {!loading && shops.length === 0 && category && (
              <p className="text-red-400">
                No shops found for "{category}"
              </p>
            )}

            {!loading && shops.length > 0 && (
              <div className="space-y-3 mt-3">

                {shops.map((shop) => (
                  <div
                    key={shop.id}
                    onClick={() => navigate(`/shops/${shop.id}`)}
                    className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl cursor-pointer transition"
                  >
                    <h3 className="font-semibold">{shop.name}</h3>
                    <p className="text-sm text-gray-400">
                      {shop.category}
                    </p>
                  </div>
                ))}

              </div>
            )}

            {!loading && shops.length === 0 && !category && (
              <p className="text-gray-400">
                Start by searching a category
              </p>
            )}
          </div>
          <div className="bg-gray-900 rounded-2xl p-5">
            <h3 className="font-bold mb-3">Quick Explore</h3>

            <div className="flex flex-wrap gap-2">

              {["Food & Drinks", "Retail", "Clothing", "Education", "Printing", "Health & Beauty","Bakery"].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setInput(c);
                    setCategory(c);
                    handleSearch();
                  }}
                  className="px-3 py-1 rounded-full bg-gray-800 hover:bg-gray-700 text-sm"
                >
                  #{c}
                </button>
              ))}

            </div>
          </div>

        </div>

        <div className="col-span-12 md:col-span-7 lg:col-span-8">

          <div className="bg-gray-900 rounded-2xl p-5 mb-6">
            <h2 className="text-lg font-bold mb-2">Featured Visuals</h2>
            <p className="text-gray-400 text-sm">
              Explore local shop visuals and locations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          {[
            { img: "/image/shop1.jpg", name: "Wakitos Pizza & Coffee" },
            { img: "/image/shop2.jpg", name: "Makoo" },
            { img: "/image/shop3.webp", name: "the Latte Haus" },
            { img: "/image/shop4.jpg", name: "GEMEO" },
            { img: "/image/shop5.jpg", name: "Joe's Brew" },
            { img: "/image/pbmap.png", name: "Pulong Buhangin Map" },
          ].map((item, i) => (
            
            <div
              key={i}
              className="relative aspect-square overflow-hidden rounded-2xl group">
              <img
                src={item.img}
                className="w-full h-full object-cover transition duration-300 group-hover:blur-sm group-hover:scale-105"/>


              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300">
                <h2 className="text-white text-xl font-bold tracking-wide">
                  {item.name}
                </h2>
              </div>
            </div>

          ))}

        </div>
        </div>

      </div>
    </div>
  );
}

export default Body