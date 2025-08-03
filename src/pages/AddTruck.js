import { useState } from "react";

export default function AddTruck({ onAddTruck }) {
  const [vehicleNo, setVehicleNo] = useState("");
  const [rstNo, setRstNo] = useState("");
  const [partyName, setPartyName] = useState("");
  const [transport, setTransport] = useState("");
  const [grossWeight, setGrossWeight] = useState("");
  const [tareWeight, setTareWeight] = useState("");
  const [bags, setBags] = useState("");
  const [remarks, setRemarks] = useState("");
  const [type, setType] = useState("Loading"); // ✅ New field

  const netWeight = grossWeight && tareWeight ? grossWeight - tareWeight : "";

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTruck({
      vehicleNo,
      rstNo,
      partyName,
      transport,
      grossWeight,
      tareWeight,
      netWeight,
      bags,
      remarks,
      type, // ✅ Include truck type
    });

    // Reset form
    setVehicleNo("");
    setRstNo("");
    setPartyName("");
    setTransport("");
    setGrossWeight("");
    setTareWeight("");
    setBags("");
    setRemarks("");
    setType("Loading");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Truck Entry</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded space-y-4 max-w-xl">
        
        <input className="w-full border rounded p-2" placeholder="Vehicle No" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} required />
        <input className="w-full border rounded p-2" placeholder="RST No" value={rstNo} onChange={(e) => setRstNo(e.target.value)} required />
        <input className="w-full border rounded p-2" placeholder="Party Name" value={partyName} onChange={(e) => setPartyName(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Transport" value={transport} onChange={(e) => setTransport(e.target.value)} />

        <select className="w-full border rounded p-2" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Loading">Loading</option>
          <option value="Unloading">Unloading</option>
        </select>

        <input type="number" className="w-full border rounded p-2" placeholder="Gross Weight" value={grossWeight} onChange={(e) => setGrossWeight(Number(e.target.value))} />
        <input type="number" className="w-full border rounded p-2" placeholder="Tare Weight" value={tareWeight} onChange={(e) => setTareWeight(Number(e.target.value))} />

        <input type="text" className="w-full border rounded p-2 bg-gray-100" placeholder="Net Weight" value={netWeight} readOnly />

        <input type="number" className="w-full border rounded p-2" placeholder="No. of Bags" value={bags} onChange={(e) => setBags(e.target.value)} />
        <textarea className="w-full border rounded p-2" placeholder="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Entry
        </button>
      </form>
    </div>
  );
}
