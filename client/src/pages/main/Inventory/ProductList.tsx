import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
} from "@mui/x-data-grid";
import { parseISO, format } from "date-fns";
import { handleGetProducts } from "../../../actions/product";
import { addBaseURL } from "../../../utils/addBaseURL";
import { Chip, Tooltip } from "@mui/material";

// Define the columns based on the Product model
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 50 },
  { field: "name", headerName: "Name", flex: 1 },
  {
    field: "image",
    headerName: "Photo",
    width: 150,
    renderCell: (params) => (
      <img
        src={addBaseURL(params.value)}
        alt={params.row.name}
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          padding: "4px",
          borderRadius: "8px",
        }}
      />
    ),
  },
  {
    field: 'category',
    headerName: "Categories",
    flex: 1,
    renderCell: (params) => (
      <div className="h-full flex items-center gap-2">
      {params.row.category && (
        <Tooltip title="Category" arrow>
          <Chip label={params.row.category.name} color="primary" />
        </Tooltip>
      )}
      {params.row.subCategories?.map((item: string, index: number) => (
        <Tooltip title="Sub Category" arrow key={index}>
          <Chip label={item} />
        </Tooltip>
      ))}
    </div>
    )
  },
  { field: "rentalCostPerDay", headerName: "Rental Cost/Day", flex: 1 },
  {
    field: "createdAt",
    headerName: "Created At",
    flex: 1,
    valueFormatter: (_, row) => {
      if (!row.createdAt) return "N/A";
      return format(parseISO(row.createdAt), "yyyy-MM-dd HH:mm");
    },
  },
];

export default function ProductList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const [loading, setLoading] = useState(true);

  console.log(rows)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await handleGetProducts(
          paginationModel.page + 1,
          paginationModel.pageSize
        );

        // Ensure that the data structure is correct
        if (data && data.customers) {
          const updatedData = data.customers?.map((item: any, index: number) => ({
            id: index + 1,
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

    fetchProducts();
  }, [paginationModel]);

  const handlePaginationModelChange = (
    newPaginationModel: GridPaginationModel
  ) => {
    setPaginationModel(newPaginationModel);
  };

  const handleRowClick = (params: GridRowParams) => {
    navigate(`/products/${params.row._id}/inventory`);
  };

  return (
    <div className="mt-12">
      <DataGrid
        rows={rows}
        getRowId={(row) => row.id}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[5, 10]}
        loading={loading}
        onRowClick={handleRowClick}
        sx={{
          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },
          backgroundColor: "white",
        }}
      />
    </div>
  );
}
