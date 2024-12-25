import { Link, Outlet, useLocation } from "react-router-dom";
import Breadcumbs from "../../../components/Breadcumbs";

export default function CutomersLayout() {
  const location = useLocation()
  
  return (
    <div className="text-black h-screen flex flex-col">
      <div className="px-10 py-5 border-b flex justify-between items-center">
        <Breadcumbs />

        {!location.pathname.includes("/new") && (
          <Link
            to="/customers/new"
            type="button"
            className="bg-blue-700 p-2 rounded-md text-white"
          >
            Add Customer
          </Link>
        )}
      </div>

        <Outlet />
    </div>
  );
}
