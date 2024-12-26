import { Button } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

export default function OrdersLayout() {
  return (
    <div className="text-black">
      <div className="flex flex-col justify-between">
        <div className="px-10 py-6 border-b flex justify-between">
          <span className="text-2xl">Orders</span>
          
          <Link to="/orders/new">
            <Button variant="contained" size="small">Add order</Button>
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
