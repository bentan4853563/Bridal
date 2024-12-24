import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function MainPageLayout() {
  return (
    <div className="flex">
      <Sidebar />
      
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
