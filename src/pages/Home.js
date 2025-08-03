import TruckList from "../components/TruckList";

export default function Home({ trucks }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Trucks</h2>
      <TruckList trucks={trucks} />
    </div>
  );
}
