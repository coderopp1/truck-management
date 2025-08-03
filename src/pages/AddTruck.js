import { useState } from "react";

export default function AddTruck({ onAddTruck }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Loading");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTruck(name, type);
    setName("");
    setType("Loading");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add a New Truck</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded space-y-4 max-w-md"
      >
        <div>
          <label className="block mb-1">Truck Name:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter truck name"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Truck Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="Loading">Loading</option>
            <option value="Unloading">Unloading</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Truck
        </button>
      </form>
    </div>
  );
}
