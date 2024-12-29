import { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { handleAddStockItem } from "../../actions/product";
import { useParams } from "react-router-dom";
import { Product } from "../../types";
import { toast } from "react-toastify";

interface AddStockModalProps {
  open: boolean;
  name: string;
  isAdd: boolean;
  currentQuantity: number;
  onSuccess: (data: Product | null) => void; // Ensure onSuccess is typed correctly
  onClose: () => void;
}

const AddStockModal: React.FC<AddStockModalProps> = ({
  open,
  isAdd,
  currentQuantity,
  onSuccess,
  onClose,
}) => {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);

  const addStockItem = async () => {
    if (params.id) {
      try {
        if (!isAdd && quantity > currentQuantity) {
          toast.error("Please set quantity currectly.");
        } else {
          const updatedQuantity = isAdd ? quantity : quantity * -1;
          const updatedProduct: Product | null = await handleAddStockItem(
            params.id,
            updatedQuantity
          ); // Ensure this returns a Product
          toast.success(
            `${isAdd ? "Added" : "Removed"} stock Items successfully.`
          );
          onSuccess(updatedProduct); // Pass the updated product to onSuccess
          setQuantity(1);
          onClose();
        }
      } catch (error) {
        console.error("Error adding stock item:", error);
        // Handle error (e.g., show a notification)
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="bg-white text-black rounded-lg p-6 w-full max-w-md mx-auto"
        sx={{ mt: "10%", boxShadow: 24 }}
      >
        <Typography variant="h6" className="py-2">
          Add stock items
        </Typography>
        <Divider />
        <div className="my-4">
          <Typography variant="body1" className="mb-2">
            Quantity
          </Typography>
          <TextField
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            size="small"
            className="w-16 text-center"
            type="number"
            inputProps={{
              min: 1, // Set the minimum value here
            }}
          />
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={addStockItem} variant="contained" color={isAdd ? "primary" : "warning"}>
            {isAdd ? "Add" : "Remove"} {quantity} stock item{quantity > 1 ? "s" : ""}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default AddStockModal;
