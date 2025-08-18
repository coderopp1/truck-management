import { useLocation } from "react-router-dom";

export default function TruckList() {
  const location = useLocation();
  const trucks = location.state?.trucks || [];

  if (!trucks.length) return <p className="p-4">No truck entries yet.</p>;

  return (
    <div className="overflow-x-auto mt-6 p-4">
      <h2 className="text-xl font-bold mb-4">All Trucks</h2>
      <table className="min-w-full border border-gray-300 text-sm sm:text-base">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Vehicle No</th>
            <th className="border p-2">RST No</th>
            <th className="border p-2">Party Name</th>
            <th className="border p-2">Transport</th>
            <th className="border p-2">Gross Weight</th>
            <th className="border p-2">Tare Weight</th>
            <th className="border p-2">Net Weight</th>
            <th className="border p-2">No. of Bags</th>
            <th className="border p-2">Remarks</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Unloading Point</th>
          </tr>
        </thead>
        <tbody>
          {trucks.map((truck) => (
            <tr key={truck.id} className="text-center border hover:bg-gray-50">
              <td className="border p-2">{truck.vehicleNo}</td>
              <td className="border p-2">{truck.rstNo || "-"}</td>
              <td className="border p-2">{truck.partyName}</td>
              <td className="border p-2">{truck.transport}</td>
              <td className="border p-2">{truck.grossWeight}</td>
              <td className="border p-2">{truck.tareWeight}</td>
              <td className="border p-2">{truck.grossWeight - truck.tareWeight}</td>
              <td className="border p-2">{truck.noOfBags}</td>
              <td className="border p-2 truncate max-w-[150px]">{truck.remarks}</td>
              <td className={`border p-2 font-semibold ${truck.type === "Loading" ? "text-green-600" : "text-orange-600"}`}>
                {truck.type}
              </td>
              <td className="border p-2">{truck.unloadingPoint || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
