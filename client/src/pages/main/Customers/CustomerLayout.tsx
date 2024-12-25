import { Link, Outlet, useParams } from "react-router-dom";

export default function CustomerLayout() {
  const tabs = [
    { label: "Information", path: "information" },
    { label: "Orders", path: "orders" },
    { label: "Cards on file", path: "cardsonfile" },
  ];

  const params = useParams();

  return (
    <div className="bg-slate-200 p-12 h-full">
      {/* Tab */}
      <div className="flex gap-4 border-b border-gray-200">
        {tabs.map((tab, index) => {
          const isActive = location.pathname.includes(tab.path);

          return (
            <Link
              to={`/customers/${params.id}/${tab.path}`}
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

      {/* Table */}
      <Outlet />
    </div>
  );
}
