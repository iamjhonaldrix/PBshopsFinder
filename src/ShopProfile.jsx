// ShopProfile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ShopProfile() {
  const { id } = useParams();
  const [shop, setShop] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/shops/detail/${id}`)
      .then((res) => res.json())
      .then((data) => setShop(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!shop) return <p className="p-6 text-gray-500">Loading shop...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{shop.name}</h1>
        <p className="text-gray-500 mb-1">Category: {shop.category}</p>
        <p className="text-gray-500">Owner: {shop.owner_username}</p>
      </div>
    </div>
  );
}