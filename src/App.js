import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AddTruck from "./pages/AddTruck";

function App() {
  const [trucks, setTrucks] = useState([]);

const handleAddTruck = (truck) => {
  setTrucks((prev) => [...prev, { id: prev.length + 1, ...truck }]);
};

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <header className="bg-blue-600 text-white p-4 flex justify-between">
          <h1 className="font-bold text-lg">Truck Management</h1>
          <nav className="space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/add" className="hover:underline">Add Truck</Link>
          </nav>
        </header>

        <main className="max-w-4xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home trucks={trucks} />} />
            <Route path="/add" element={<AddTruck onAddTruck={handleAddTruck} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
