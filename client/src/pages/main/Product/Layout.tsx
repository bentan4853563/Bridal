import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleGetProductData } from "../../../actions/product";

// Define a type for product data
interface ProductData {
  id: string;
  name: string;
  // Add other properties as needed
}

export default function ProductLayout() {
  const params = useParams<{ id: string }>();
  const location = useLocation();

  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Added loading state

  useEffect(() => {
    const fetchProductData = async () => {
      if (params.id) {
        setLoading(true); // Set loading to true
        const data = await handleGetProductData(params.id);

        if (data) {
          setProductData(data);
        }
        setLoading(false); // Set loading to false
      }
    };

    fetchProductData();
  }, [params.id]);

  const tabs = [
    { label: "Inventory", path: "inventory" },
    { label: "Setting", path: "setting" },
    { label: "History", path: "history" },
  ];

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white flex justify-start p-6 border-b border-gray-200">
        <span className="text-2xl">
          <Link to="/inventory/products" className="hover:underline">
            Inventory
          </Link>{" "}
          / {loading ? "Loading..." : productData?.name || "No Product"}
        </span>
      </div>
      <div className="h-full overflow-y-auto bg-gray-100 flex flex-col gap-4 p-6">
        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-b-gray-400">
          {tabs.map((tab, index) => {
            const isActive = location.pathname.includes(tab.path);
            return (
              <Link
                to={`/products/${params.id}/${tab.path}`}
                key={index}
                className={`pb-2 cursor-pointer box-content  ${
                  isActive
                    ? "border-b-2 border-blue-700 text-black"
                    : "border-b-2 border-transparent text-black/50"
                } hover:border-blue-400`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
        {/* Render Child Routes */}
        <Outlet context={{ productData, setProductData }} />
      </div>
    </div>
  );
}
