import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTruck({ onAddTruck }) {
  const [truck, setTruck] = useState({
    vehicleNo: "",
    rstNo: "",
    partyName: "",
    transport: "",
    grossWeight: "",
    tareWeight: "",
    noOfBags: "",
    remarks: "",
    type: "Loading",
    unloadingPoint: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setTruck({ ...truck, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Calculate net weight
    const finalTruck = {
      ...truck,
      id: Date.now(),
      grossWeight: parseInt(truck.grossWeight || 0),
      tareWeight: parseInt(truck.tareWeight || 0),
      netWeight:
        parseInt(truck.grossWeight || 0) - parseInt(truck.tareWeight || 0),
    };

    // 2️⃣ Add to local state
    onAddTruck(finalTruck);

    // 3️⃣ Send to dummy API (simulate saving to server)
    try {
      await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalTruck),
      });
    } catch (err) {
      console.error("Failed to save truck to dummy API", err);
    }

    // 4️⃣ Redirect to Home page
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="vehicleNo"
        placeholder="Vehicle No"
        value={truck.vehicleNo}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        name="rstNo"
        placeholder="RST No"
        value={truck.rstNo}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        name="partyName"
        placeholder="Party Name"
        value={truck.partyName}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        name="transport"
        placeholder="Transport"
        value={truck.transport}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        name="grossWeight"
        type="number"
        placeholder="Gross Weight"
        value={truck.grossWeight}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        name="tareWeight"
        type="number"
        placeholder="Tare Weight"
        value={truck.tareWeight}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        name="noOfBags"
        type="number"
        placeholder="No of Bags"
        value={truck.noOfBags}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        name="remarks"
        placeholder="Remarks"
        value={truck.remarks}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <select
        name="type"
        value={truck.type}
        onChange={handleChange}
        className="border p-2 w-full"
      >
        <option>Loading</option>
        <option>Unloading</option>
      </select>
      <input
        name="unloadingPoint"
        placeholder="Unloading Point / Godown No"
        value={truck.unloadingPoint}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Add Truck
      </button>
    </form>
  );
}
