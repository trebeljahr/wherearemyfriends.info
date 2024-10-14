import { UpdateMyLocation } from "src/components/UpdateMyLocation";

export function MyLocationPage() {
  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 ">
      <h1>Current Location</h1>
      <UpdateMyLocation />
    </div>
  );
}
