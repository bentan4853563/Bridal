import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axiosInstance from "../../../actions/api";
import { parseISO, format } from "date-fns";
import { OrderDetail, Payment } from "../../../types";
import { toast } from "react-toastify";

export default function PaymentList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch Payments on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("api/payments/all");

        // Add unique IDs starting from 1
        const paymentsWithId = response.data.map(
          (payment: object, index: number) => ({
            id: index + 1, // Unique ID starting from 1
            ...payment,
          })
        );

        setPayments(paymentsWithId);
      } catch (error) {
        console.error("Error fetching Payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deletePayment = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to delete this Payment.",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            try {
              await axiosInstance.delete(`api/payments/${id}`);
              toast.success("Payment deleted successfully");
              setPayments((prev) =>
                prev.filter((payment) => payment._id != id)
              );
            } catch (error) {
              console.error("Error deleting Payment:", error);
            }
          },
        },
        {
          label: "No",
          onClick: () => console.log("Deletion cancelled"),
        },
      ],
    });
    
  };

  // Define the columns based on the Payment model
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 }, // Use uniqueId here
    {
      field: "customer.name",
      headerName: "Customer",
      flex: 1,
      valueGetter: (_, row) => row.customer.name,
    },
    {
      field: "paymentType",
      headerName: "Payment Type",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 200,
    },
    {
      field: "order",
      headerName: "Reservation",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          {params.value.details
            .map((item: OrderDetail) => (
              <Link
                to={`/orders/${params.value._id}`}
                key={item.product._id}
                className="hover:underline text-blue-600"
              >
                {item.product.name}: {item.amount}
              </Link>
            ))
            .reduce((prev: OrderDetail, curr: OrderDetail) => [
              prev,
              ", ",
              curr,
            ])}
        </div>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      valueFormatter: (_, row) => {
        if (!row.date) return "N/A";
        return format(parseISO(row.date), "yyyy-MM-dd HH:mm"); // Corrected date format
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="flex gap-2 items-center">
            <Link to={`/payments/edit/${params.row._id}`}>
              <Button variant="outlined" size="small">
                Edit
              </Button>
            </Link>
            <Button
              variant="contained"
              color="warning"
              size="small"
              onClick={(e) => deletePayment(e, params.row._id)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="text-black h-screen flex flex-col">
      <div className="bg-white px-10 py-6 border-b flex justify-between">
        <span className="text-2xl">Payments</span>
        <Link to="/payments/new">
          <Button variant="contained" size="small">
            Add Payment
          </Button>
        </Link>
      </div>

      <div className="h-full bg-gray-100 p-12 flex flex-col">
        <DataGrid
          rows={payments}
          getRowId={(row) => row._id} // Use id as a unique identifier
          columns={columns}
          loading={loading}
          sx={{
            "& .MuiDataGrid-row": {
              cursor: "pointer", // Change cursor to pointer for clickable rows
            },
            backgroundColor: "white",
          }}
        />
      </div>
    </div>
  );
}
