import { Button } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

export default function OrdersLayout() {
  const tabs = [
    { label: "All", path: "" },
    { label: "Upcoming", path: "upcoming" },
    { label: "Late", path: "late" },
    { label: "With Shortage", path: "shortage" },
  ];

  return (
    <div className="text-black h-screen flex flex-col">
      <div className="bg-white px-10 py-6 border-b flex justify-between">
        <span className="text-2xl">Orders</span>

        <Link to="/orders/new">
          <Button variant="contained" size="small">
            Add order
          </Button>
        </Link>
      </div>

      <div className="h-full bg-gray-100 p-12 flex flex-col">
        {/* Tab */}
        <div className="flex gap-4 border-b border-gray-200">
          {tabs?.map((tab, index) => {  
            const isActive = location.pathname.includes(tab.path);
            return (
              <Link
                to={`/orders/${tab.path}`}
                key={index}
                className={`p-2 cursor-pointer box-content ${
                  isActive
                    ? "border-b-2 border-blue-700"
                    : "border-b-2 border-transparent"
                } hover:border-blue-400`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <Outlet />
      </div>
    </div>
  );
}
