import { useEffect, useState } from "react";
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
  onSuccess: (data: Product | null) => void; // Ensure onSuccess is typed correctly
  onClose: () => void;
}

const AddStockModal: React.FC<AddStockModalProps> = ({
  open,
  name,
  onSuccess,
  onClose,
}) => {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const [productName, setProductName] = useState("");

  useEffect(() => {
    setProductName(name);
  }, [name]);

  const addStockItem = async () => {
    if (params.id) {
      try {
        const updatedProduct: Product | null = await handleAddStockItem(
          params.id,
          quantity
        ); // Ensure this returns a Product
        toast.success("Stocked successfully")
        onSuccess(updatedProduct); // Pass the updated product to onSuccess
        setQuantity(1);
        onClose();
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
        <div className="mb-4">
          <Typography variant="body1" className="mb-2">
            Stock item identifiers
          </Typography>
          <TextField
            fullWidth
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Set a short product name"
            size="small"
            InputProps={{
              endAdornment: <Typography variant="body2">###</Typography>,
            }}
          />
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={addStockItem} variant="contained" color="primary">
            Add {quantity} stock item{quantity > 1 ? "s" : ""}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default AddStockModal;
