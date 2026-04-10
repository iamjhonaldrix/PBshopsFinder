import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

function Body() {
  const navigate = useNavigate();

  const [input, setInput] = useState("");      // what user types
  const [category, setCategory] = useState(""); // submitted search
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!input.trim()) return;  
    setCategory(input.trim());  
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/shops?category=${input.trim()}`);
      const data = await res.json();
      setShops(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12 md:col-span-6 flex flex-col justify-center p-6">
        <h1 className="text-4xl font-bold mb-4 text-white">Discover Shops in Pulong Buhangin</h1>
        <p className="mb-4 text-white">Find shops around you!</p>

        {/* Search input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search category..."
            className="border p-2 flex-1 text-black p-1 bg-white rounded-xl"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            className="bg-yellow-400 px-4 py-2 rounded-xl shadow-2xl hover:bg-yellow-500 hover:scale-105"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/* Search results */}
        <div className="">
          {loading && <p>Searching...</p>}

          {!loading && shops.length > 0 && (
            <div className="grid grid-cols-3 rows-span-3 gap-2 mt-4">
              {shops.map((shop, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/shops/${shop.id}`)}
                  className="bg-gray-900 text-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 px-6 py-8 text-center font-semibold text-lg cursor-pointer"
                >
                  {shop.name}
                </div>
              ))}
            </div>
          )}

          {/* Only show "No shops found" if a search was submitted */}
          {!loading && shops.length === 0 && category && (
            <p className="mt-4 text-red-500">No shops found for "{category}"</p>
          )}
        </div>
      </div>

      {/* Images */}
      <div className="col-span-6 grid grid-cols-3 gap-4 p-6">
        <div className="aspect-square">
          <img src="/image/shop1.jpg" alt="shop1" className="w-full h-full object-cover rounded-4xl shadow-xl/40"/>
        </div>
        <div className="aspect-square">
          <img src="/image/shop2.jpg" alt="shop2" className="w-full h-full object-cover rounded-4xl shadow-xl/40"/>
        </div>
        <div className="aspect-square">
          <img src="/image/shop3.webp" alt="shop3" className="w-full h-full object-cover rounded-4xl shadow-xl/40"/>
        </div>
        <div className="aspect-square">
          <img src="/image/shop4.jpg" alt="shop4" className="w-full h-full object-cover rounded-4xl shadow-xl/40"/>
        </div>
        <div className="aspect-square">
          <img src="/image/shop5.jpg" alt="pb map 1" className="w-full h-full object-cover rounded-4xl shadow-xl/40"/>
        </div>
        <div className="aspect-square">
          <img src="/image/pbmap.png" alt="pb map 2" className="w-full h-full object-cover rounded-4xl shadow-xl/40"/>
        </div>
      </div>
    </div>
  );
}

export default Body;