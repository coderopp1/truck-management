export default function TruckList({ trucks }) {
  if (!trucks.length) return <p>No truck entries yet.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Vehicle No</th>
            <th className="border p-2">RST No</th>
            <th className="border p-2">Party Name</th>
            <th className="border p-2">Transport</th>
            <th className="border p-2">Type</th> {/* ✅ New */}
            <th className="border p-2">Gross Weight</th>
            <th className="border p-2">Tare Weight</th>
            <th className="border p-2">Net Weight</th>
            <th className="border p-2">No. of Bags</th>
            <th className="border p-2">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {trucks.map((truck, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border p-2">{truck.vehicleNo}</td>
              <td className="border p-2">{truck.rstNo}</td>
              <td className="border p-2">{truck.partyName}</td>
              <td className="border p-2">{truck.transport}</td>
              <td className="border p-2 font-semibold">
                <span className={truck.type === "Loading" ? "text-green-600" : "text-orange-600"}>
                  {truck.type}
                </span>
              </td>
              <td className="border p-2">{truck.grossWeight}</td>
              <td className="border p-2">{truck.tareWeight}</td>
              <td className="border p-2 font-bold">{truck.netWeight}</td>
              <td className="border p-2">{truck.bags}</td>
              <td className="border p-2">{truck.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
