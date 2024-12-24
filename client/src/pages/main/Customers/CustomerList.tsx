import { useState, useEffect } from "react";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
} from "@mui/x-data-grid";
import { handleGetCustomers } from "../../../actions/customer";
import { useNavigate } from "react-router-dom";

// Define the columns based on the Customer model
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 50 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "address", headerName: "Address", width: 200 },
  { field: "city", headerName: "City", width: 130 },
  { field: "phone", headerName: "Phone", width: 130 },
  { field: "whatsApp", headerName: "WhatsApp", width: 130 },
  { field: "date", headerName: "Date", width: 120 },
  { field: "location", headerName: "Location", width: 150 },
  { field: "type", headerName: "Type", width: 100 },
];

export default function CustomerList() {
  const navigate = useNavigate();

  // State to hold customer rows, pagination model, and loading state
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const [loading, setLoading] = useState(true);

  // Fetch customers on pagination model change
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const data = await handleGetCustomers(
          paginationModel.page + 1,
          paginationModel.pageSize
        );

        // Update rows with fetched data, ensuring unique IDs
        if (data) {
          const updatedData = data.customers.map((item: GridColDef, index: number) => ({
            id: paginationModel.page * paginationModel.pageSize + index + 1,
            ...item,
          }));
          setRows(updatedData);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [paginationModel]);

  // Handle pagination model changes
  const handlePaginationModelChange = (
    newPaginationModel: GridPaginationModel
  ) => {
    setPaginationModel(newPaginationModel);
  };

  // Navigate to edit page on row click
  const handleRowClick = (params: GridRowParams) => {
    navigate(`/customers/edit/${params.row._id}`);
  };

  return (
    <div className="p-12">
      <DataGrid
        rows={rows}
        getRowId={(row) => row._id} // Use _id as a unique identifier
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
        }}
      />
    </div>
  );
}
