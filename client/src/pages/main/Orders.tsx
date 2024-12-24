import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Orders() {
  return (
    <div className="text-black">
      <Box component="section" sx={{ p: 2, border: "1px solid lightgrey" }}>
        <Typography variant="h4">Orders</Typography>
      </Box>
    </div>
  );
}
