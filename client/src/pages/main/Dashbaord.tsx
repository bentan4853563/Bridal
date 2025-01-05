import { Container, Divider, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Dashbaord() {
  return (
    <div className="text-black">
      <Box component="section" sx={{p: 2}}>
        <Typography variant="h4">Dashboard</Typography>
      </Box>
      <Divider />
      <Container className="p-4 flex flex-col gap-4">
        <Box
          sx={{ px: 4, py: 2, border: "1px solid lightgray", borderRadius: 2 }}
        >
          <Typography className="text-left">
            You have 13 days left to confirm your email address
            (nicolas1303563@gmail.com).
          </Typography>
        </Box>

        <Stack
          sx={{ px: 4, py: 2, border: "1px solid lightgray", borderRadius: 2 }}
        >
          <Typography className="text-left">
            You have 13 days left to confirm your email address
            (nicolas1303563@gmail.com).
          </Typography>
        </Stack>
      </Container>
    </div>
  );
}
