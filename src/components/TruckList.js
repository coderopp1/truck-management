export default function TruckList({ trucks }) {
  if (!trucks.length) return <p>No trucks available.</p>;

  return (
    <ul className="space-y-3">
      {trucks.map((truck) => (
        <li
          key={truck.id}
          className="p-3 bg-white shadow rounded flex justify-between"
        >
          <span>{truck.name}</span>
          <span
            className={`px-2 py-1 rounded text-white ${
              truck.type === "Loading" ? "bg-green-500" : "bg-orange-500"
            }`}
          >
            {truck.type}
          </span>
        </li>
      ))}
    </ul>
  );
}
