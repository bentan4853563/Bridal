import { Link, Outlet } from "react-router-dom";
import LogoImg from "../../assets/logo_black.png";

export default function Layout() {
  return (
    <div className="md:grid grid-cols-2 h-[100vh] ">
      <Link to='/' className="col-span-1 flex flex-col justify-center">
        <img src={LogoImg} alt="" />
      </Link>
      <div className="col-span-1">
        <Outlet />
      </div>
    </div>
  );
}
