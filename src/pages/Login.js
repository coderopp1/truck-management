import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Login({ onLogin }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phone_number: phoneNumber,
          password,
        }),
      });

      const data = await res.json();
      console.log("Login Response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

     // After successful login
const { token, user } = data;

// Store minimal necessary data
Cookies.set(
  "auth",
  JSON.stringify({
    token,
    userId: user.id,
    name: user.name,
    role: user.role,
    type: user.type,
    // Add only required fields
  }),
  {
    expires: 7,
    secure: true,      // Ensures HTTPS (important for production)
    sameSite: "strict", // Prevents CSRF
    path: "/",         // Accessible across your app
  }
);

      console.log(Cookies);
      // Update parent/app state
      if (onLogin) {
        onLogin(data.user);
      }

      // Small delay to ensure cookie is saved before navigating
      setTimeout(() => {
        navigate("/");
      }, 50);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-1">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
