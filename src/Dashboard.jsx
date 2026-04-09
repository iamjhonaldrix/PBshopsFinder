import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();

  // Get user_id from localStorage (saved during login)
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    // Fetch user shops
    fetch(`http://127.0.0.1:5000/api/shops/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
        setShops(data.shops);
      })
      .catch((err) => console.error(err));
  }, [userId, navigate]);

  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome, {username}!</h1>

      <h2 className="text-2xl font-semibold mb-4">Your Shops</h2>
      {shops.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="p-4 border rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg">{shop.name}</h3>
              <p className="text-gray-600">{shop.category}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">You have no shops yet.</p>
      )}
    </div>
  );
}