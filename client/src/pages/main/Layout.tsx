import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useEffect } from "react";

export default function MainPageLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = sessionStorage.getItem('token')

    if(!token) {
      navigate('/')
    }
  }, [])

  return (
    <div className="flex text-black">
      <Sidebar />
      
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
