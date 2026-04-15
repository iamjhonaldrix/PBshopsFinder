import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

function Businesses() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${BASE_URL}/api/shops`);
        const data = await res.json();

        setShops(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setShops([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  // 🔒 AUTH CHECK
  const requireLogin = () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Please login first");
      return null;
    }
    return userId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* HEADER */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold">Businesses Feed</h1>
        <p className="text-gray-400 mt-2">
          Discover products from local shops
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-10 space-y-6">

        {loading && (
          <p className="text-center text-yellow-300 animate-pulse">
            Loading feed...
          </p>
        )}

        {!loading && shops.length === 0 && (
          <p className="text-center text-gray-400">
            No businesses available
          </p>
        )}

        {!loading &&
          shops.map((shop) => (
            <div
              key={shop.id}
              className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg relative"
            >

              {/* HEADER */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">

                <div>
                  <h2 className="font-bold">{shop.name}</h2>
                  <p className="text-xs text-gray-400">
                    {shop.category || "Uncategorized"}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/shops/${shop.id}`)}
                  className="text-sm text-yellow-400 hover:text-yellow-300"
                >
                  View Shop
                </button>

              </div>

              {/* IMAGE */}
              <div className="aspect-square bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-400 pointer-events-none" />

              {/* FOOTER */}
              <div className="p-4 space-y-3">

                <div className="flex justify-between items-center">

                  <div className="flex gap-6 items-center">

                    {/* ❤️ REACTION */}
                    <button
                      type="button"
                      className="cursor-pointer select-none flex items-center gap-1 hover:text-red-400 transition"
                      onClick={async () => {
                        const userId = requireLogin();
                        if (!userId) return;

                        const res = await fetch(
                          `${BASE_URL}/api/shops/${shop.id}/react`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ user_id: userId }),
                          }
                        );

                        const data = await res.json();

                        setShops((prev) =>
                          prev.map((s) =>
                            s.id === shop.id
                              ? {
                                  ...s,
                                  likes: data.count,
                                  reacted: data.reacted,
                                }
                              : s
                          )
                        );
                      }}
                    >
                      <span className={shop.reacted ? "text-red-500" : ""}>
                        {shop.reacted ? "❤️" : "🤍"}
                      </span>
                      <span>{shop.likes ?? 0}</span>
                    </button>

                    {/* ⭐ RATING */}
                    <div className="flex gap-1 text-2xl">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="cursor-pointer select-none"
                          onClick={async () => {
                            const userId = requireLogin();
                            if (!userId) return;

                            const res = await fetch(
                              `${BASE_URL}/api/shops/${shop.id}/rate`,
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  user_id: userId,
                                  value: star,
                                }),
                              }
                            );

                            const data = await res.json();

                            setShops((prev) =>
                              prev.map((s) =>
                                s.id === shop.id
                                  ? {
                                      ...s,
                                      rating: data.average,
                                      user_rating: data.user_rating,
                                    }
                                  : s
                              )
                            );
                          }}
                        >
                          <span
                            className={
                              (shop.user_rating ?? 0) >= star
                                ? "text-yellow-400"
                                : "text-gray-600"
                            }
                          >
                            ★
                          </span>
                        </button>
                      ))}
                    </div>

                  </div>

                  <span className="text-xs text-gray-400">
                    ⭐ {shop.rating ?? 0}
                  </span>

                </div>

              </div>

            </div>
          ))}
      </div>
    </div>
  );
}

export default Businesses;