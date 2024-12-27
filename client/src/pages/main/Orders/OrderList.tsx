import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
} from "@mui/x-data-grid";
import { parseISO, format } from "date-fns";
import { handleGetOrders, handleOrderPay } from "../../../actions/order";
import { Button, Chip } from "@mui/material";
import { Order } from "../../../types";

export default function OrderList() {
  const navigate = useNavigate();
  // State to hold Product rows, pagination model, and loading state
  const [rows, setRows] = useState<Order[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 1,
    pageSize: 5,
  });
  const [loading, setLoading] = useState(true);

  // Define the columns based on the Product model
  const columns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 200 },
    {
      field: "customer.name",
      headerName: "Customer",
      flex: 1,
      valueGetter: (_, row) => row.customer.name,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        return params.value == "Reserved" ? (
          <Chip label={params.value} color="success" />
        ) : params.value == "Picked up" ? (
          <Chip label={params.value} color="warning" />
        ) : (
          <Chip label={params.value} color="default" />
        );
      },
    },
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
          <Chip
            onClick={(e) => handlePay(e, params.row._id)}
            label="Paid"
            color="success"
          />
        ) : (
          <Button
            onClick={(e) => handlePay(e, params.row._id)}
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

  // Fetch Products on pagination model change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await handleGetOrders(
          paginationModel.page,
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
      } catch (error) {
        console.error("Error fetching Products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paginationModel]);

  // Handle pagination model changes
  const handlePaginationModelChange = (
    newPaginationModel: GridPaginationModel
  ) => {
    setPaginationModel(newPaginationModel);
  };

  // Navigate to edit page on row click
  const handleRowClick = (params: GridRowParams) => {
    navigate(`/orders/${params.id}`)
  };

  const handlePay = async (
    event: React.MouseEvent,
    id: string
  ): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();

    const updatedOrder: Order = await handleOrderPay(id);

    setRows((prev) =>
      prev.map((order) =>
        order._id == updatedOrder._id ? updatedOrder : order
      )
    );
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
