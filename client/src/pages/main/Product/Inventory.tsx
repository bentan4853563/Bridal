import { Button } from "@mui/material";
import { useState } from "react";
import AddStockModal from "../../../components/modals/AddStockModal";
import { useOutletContext } from "react-router-dom";
import { ProductData } from "../../../types";
import { getImageURL } from "../../../utils/getImageURL";

export default function ProductInventory() {
  const { productData } = useOutletContext<{
    productData: ProductData | null;
  }>();

  console.log('productData :>> ', productData);

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
            onClose={() => setIsShowAddStockModal(false)}
            name={productData.name}
          />
        )}

        <table className="w-full">
          <thead className="border-b">
            <th></th>
            <th>Product Name</th>
            <th>Status</th>
            <th>In Stock</th>
            <th>Picked up</th>
            <th>Total</th>
          </thead>
          <tbody>
            <tr>
              <td>
                {productData?.primaryPhoto ? (
                  <img
                    src={getImageURL(String(productData.primaryPhoto))}
                    alt="Product"
                    className="w-16 h-16"
                  />
                ) : (
                  "No image available"
                )}
              </td>
              <td>{productData?.name}</td>
              <td>{productData?.status}</td>
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
