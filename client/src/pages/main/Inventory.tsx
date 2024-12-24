import { Outlet } from "react-router-dom";

export default function Inventory() {
  return (
    <div className="text-black">
      <div className="flex flex-col">
        <div className="px-10 py-6 border-b flex justify-between">
          <h2 className="text-2xl">Inventory</h2>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
