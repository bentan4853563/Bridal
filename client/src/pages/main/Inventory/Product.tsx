import { Link, useLocation } from "react-router-dom";

export default function Product() {
  const location = useLocation();

  const tabs = [
    { label: "Products", path: "product" },
    { label: "Bundles", path: "bundles" },
    { label: "Collections", path: "collection" },
  ];

  return (
    <div className="flex flex-col gap-4 p-10">
      {/* Tab */}
      <div className="p-2 flex gap-4 border-b">
        {tabs?.map((tab, index) => {
          const isActive = location.pathname.includes(tab.path);

          return (
            <Link
              to={`/product/${tab.path}`}
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
    </div>
  );
}
