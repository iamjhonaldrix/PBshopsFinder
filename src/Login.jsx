import { useState } from "react";

import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("username", data.username);

      // Redirect to dashboard
      navigate("/dashboard");
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-10 w-96 rounded-3xl bg-yellow-500 shadow-xl/80">
        <h1 className="text-3xl font-bold mb-6 text-center">Log In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
            className="bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800"
          >
            Log In
          </button>
        </form>
        {message && <p className="text-green-600 text-center mt-4">{message}</p>}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account? <a href="/signup" className="text-black font-semibold hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
}