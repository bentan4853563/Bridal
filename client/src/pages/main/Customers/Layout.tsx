import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@mui/material";

export default function CutomersLayout() {
  const location = useLocation();
  const pathNames = location.pathname.split('/').filter(x => x)

  return (
    <div className="text-black h-screen flex flex-col">
      <div className="bg-white px-10 py-6 border-b flex justify-between items-center">
        <span className="text-2xl">Customers {pathNames.includes('new') && '/ new'}</span>

        {!location.pathname.includes("/new") && (
          <Link to="/customers/new">
            <Button variant="contained" size="small">
              Add Customer
            </Button>
          </Link>
        )}
      </div>

      <Outlet />
    </div>
  );
}
