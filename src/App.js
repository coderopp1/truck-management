import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import Home from "./pages/Home";
import AddTruck from "./pages/AddTruck";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import TruckList from "./components/TruckList";

function App() {
  const [trucks, setTrucks] = useState([]);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load auth state from cookies when app starts
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        setUsername(userData.name);
      } catch (err) {
        console.error("Error parsing cookie", err);
        Cookies.remove("user");
      }
    }
    setLoading(false);
  }, []);

  const handleAddTruck = (truck) => {
    setTrucks((prev) => [...prev, { id: prev.length + 1, ...truck }]);
  };

  const handleLogin = (user) => {
    setUsername(user.name);
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
  };

  const handleLogout = () => {
    setUsername(null);
    Cookies.remove("user");
  };

  const isLoggedIn = !!username;

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Navbar username={username} setUsername={handleLogout} />

        <main className="max-w-4xl mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn} loading={loading}>
                  <Home trucks={trucks} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn} loading={loading}>
                  <AddTruck onAddTruck={handleAddTruck} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trucks"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn} loading={loading}>
                  <TruckList />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
