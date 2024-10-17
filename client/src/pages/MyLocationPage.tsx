import { UpdateMyLocation } from "../components/UpdateMyLocation";

export function MyLocationPage() {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 ">
      <h1>Current Location</h1>
      <UpdateMyLocation />
    </div>
  );
}
