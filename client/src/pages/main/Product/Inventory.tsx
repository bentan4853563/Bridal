import { Button } from "@mui/material";
import { useState } from "react";
import AddStockModal from "../../../components/modals/AddStockModal";
import { useOutletContext } from "react-router-dom";
import { Product } from "../../../types";

export default function ProductInventory() {
  const { productData, setProductData } = useOutletContext<{
    productData: Product | null;
    setProductData: (data: Product | null) => void; // Ensure setProductData is typed
  }>();

  const [isShowAddStockModal, setIsShowAddStockModal] = useState(false);

  return (
    <div className="flex flex-col items-start gap-4">
      <Button
        className="ml-auto"
        variant="contained"
        onClick={() => setIsShowAddStockModal(true)}
      >
        Add Stock Items
      </Button>
      <div className="w-full bg-white p-4 border rounded-lg flex flex-col items-start gap-2">
        {productData && (
          <AddStockModal
            open={isShowAddStockModal}
            name={productData.name}
            onSuccess={(data) => setProductData(data)} // Corrected function name
            onClose={() => setIsShowAddStockModal(false)}
          />
        )}
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th>Photo</th>
              <th>Product Name</th>
              <th>In Stock</th>
              <th>Picked up</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {productData?.image ? (
                  <img
                    src={productData.image}
                    alt="Product"
                    className="w-16 h-16 rounded-lg"
                  />
                ) : (
                  "No image available"
                )}
              </td>
              <td>{productData?.name}</td>
              <td>{productData?.quantity}</td>
              <td></td>
              <td>{productData?.quantity}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
