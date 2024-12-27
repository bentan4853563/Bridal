import { useState, useEffect } from "react";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
} from "@mui/x-data-grid";
import { parseISO, format } from "date-fns";
import { handleGetOrdersByCustomer, handleOrderPay } from "../../../actions/order";
import { useParams } from "react-router-dom";
import { Button, Chip } from "@mui/material";

// Define the columns based on the Product model
const columns: GridColDef[] = [
  { field: "id", headerName: "Id", width: 200 },
  {
    field: "customer.name",
    headerName: "Customer",
    flex: 1,
    valueGetter: (_, row) => row.customer.name,
  },
  { field: "status", headerName: "Status", flex: 1 },
  {
    field: "reserveDate",
    headerName: "Reserve Date",
    flex: 1,
    valueFormatter: (_, row) => {
      if (!row.reserveDate) return "N/A";
      return format(parseISO(row.reserveDate), "yyyy-MM-dd HH:mm");
    },
  },
  {
    field: "returnDate",
    headerName: "Return Date",
    flex: 1,
    valueFormatter: (_, row) => {
      if (!row.reserveDate) return "N/A";
      return format(parseISO(row.reserveDate), "yyyy-MM-dd HH:mm");
    },
  },
  {
    field: "paymentStatus",
    headerName: "Payment Status",
    flex: 1,
    renderCell: (params) => {
      return params.value ? (
        <Chip label="Paid" color="success" />
      ) : (
        <Button
          onClick={() => handleOrderPay(params.row._id)}
          variant="contained"
          color="primary"
          size="small"
        >
          Pay
        </Button>
      );
    },
  },
];

export default function Orders() {
  const params = useParams();
  // State to hold Product rows, pagination model, and loading state
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const [loading, setLoading] = useState(true);

  // Fetch Products on pagination model change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (params.id) {
          const data = await handleGetOrdersByCustomer(
            params.id,
            paginationModel.page + 1,
            paginationModel.pageSize
          );

          // Update rows with fetched data, ensuring unique IDs
          if (data) {
            const updatedData = data.map((item: object, index: number) => ({
              id: paginationModel.page * paginationModel.pageSize + index + 1,
              ...item,
            }));
            setRows(updatedData);
          }
        }
      } catch (error) {
        console.error("Error fetching Products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [paginationModel]);

  // Handle pagination model changes
  const handlePaginationModelChange = (
    newPaginationModel: GridPaginationModel
  ) => {
    setPaginationModel(newPaginationModel);
  };

  // Navigate to edit page on row click
  const handleRowClick = (params: GridRowParams) => {
    console.log("params.row :>> ", params.row);
  };

  return (
    <div className="p-12 text-black">
      <DataGrid
        rows={rows}
        getRowId={(row) => row._id} // Use id as a unique identifier
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[5, 10]} // Pagination options
        loading={loading} // Show loading state
        onRowClick={handleRowClick} // Handle row click for navigation
        sx={{
          "& .MuiDataGrid-row": {
            cursor: "pointer", // Change cursor to pointer for clickable rows
          },
          backgroundColor: "white",
        }}
      />
    </div>
  );
}
