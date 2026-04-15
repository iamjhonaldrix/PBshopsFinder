import { useState } from "react";
const BASE_URL = import.meta.env.VITE_API_URL;


export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${BASE_URL}/api/register`,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
   <div className="flex items-center justify-center min-h-screen">
  <div className="bg-yellow-500 text-black rounded-3xl shadow-xl/80 p-10 w-96">
    <h1 className="text-3xl font-bold mb-6 text-center">Signup</h1>
    
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="bg-blue-100 p-3 border border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 transition"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-blue-100 p-3 border border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-700 transition"
        required
      />
      <button
        type="submit"
        className="bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition transform hover:scale-105"
      >
        Signup
      </button>
    </form>

    {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    
    <p className="mt-6 text-center text-black">
      Already have an account? <a href="/login" className="text-black font-semibold hover:underline">Login</a>
    </p>
  </div>
</div>
    );
}