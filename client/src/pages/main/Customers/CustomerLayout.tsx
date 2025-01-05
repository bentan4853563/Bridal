import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { Customer } from "../../../types";
import { handleGetCustomerData } from "../../../actions/customer";

export default function CustomerLayout() {
  const params = useParams();
  
  const [customer, SetCustomer] = useState<Customer | null>(null)

  const tabs = [
    { label: "Information", path: "information" },
    { label: "Orders", path: "orders" },
    { label: "Payments", path: "payments" },
  ];

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (params.id) {
        const data = await handleGetCustomerData(params.id);
        if (data) {
          SetCustomer(data);
        }
      }
    };

    fetchCustomerData();
  }, [params.id]);

  return (
    <div className="text-black h-screen flex flex-col">
      <div className="bg-white px-10 py-6 border-b flex justify-between items-center">
        <span className="text-2xl">Customers / {customer?.name}</span>
      </div>

      <div className="bg-gray-100 p-12 h-full">
        {/* Tab */}
        <div className="flex gap-4 border-b border-gray-200">
          {tabs.map((tab, index) => {
            const isActive = location.pathname.includes(tab.path);

            return (
              <Link
                to={`/customers/${params.id}/${tab.path}`}
                key={index}
                className={`pb-2 cursor-pointer box-content ${
                  isActive
                    ? "border-b-4 border-blue-700"
                    : "border-b-4 border-transparent"
                } hover:border-blue-400`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Table */}
        <Outlet />
      </div>
    </div>
  );
}
