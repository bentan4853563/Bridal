import { Outlet } from "react-router-dom";


export default function DashboardLayout() {
  return (
    <div className="text-black">
      <div className="bg-white flex flex-col">
        <div className="px-10 py-6 border-b flex justify-between">
          <h2 className="text-xl">Dashboard</h2>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
