import { Link, Outlet, useLocation } from "react-router-dom";

export default function InventoryLayout() {
  const location = useLocation();

  const lastPath = location.pathname.split("/").filter(x=> x)[1];

  const tabs = [
    { label: "Products", path: "products" },
    { label: "Category Setting", path: "setting" }
  ];

  return (
    <div className="text-black h-screen flex flex-col">
      <div className="bg-white px-10 py-5 border-b flex justify-between items-center">
        <span className="text-2xl">Inventory / {lastPath}</span>

        {!location.pathname.includes("/new") && (
          <Link
            to={`/product/new`}
            type="button"
            className="bg-blue-700 p-2 rounded-md text-white"
          >
            Add{" "}
            {lastPath === "products"
              ? "product"
              : lastPath === "bundles"
              ? "bundle"
              : "collection"}
          </Link>
        )}
      </div>

      <div className="bg-slate-100 p-12 h-full overflow-y-auto">
        {/* Tab */}
        <div className="flex gap-4 border-b border-gray-200">
          {tabs?.map((tab, index) => {
            const isActive = location.pathname.includes(tab.path);

            return (
              <Link
                to={`/inventory/${tab.path}`}
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
    </div>
  );
}
