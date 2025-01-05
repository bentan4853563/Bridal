import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { handleForgotPassword } from "../../actions/auth";
import { toast } from "react-toastify";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    handleForgotPassword(email, () => {
      toast.success("Check your email for the reset link");
      setLoading(false);
      setEmail("")
    });
  };

  return (
    <Container maxWidth="sm" className="mt-72">
      <Paper elevation={2} className="p-5 flex flex-col gap-2">
        <Typography variant="h5" component="h1" className="text-left">
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="dense"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            Send Reset Link
          </Button>
        </form>
        {loading && <CircularProgress color="primary" size="30px" className="mx-auto" />}
        <span className="text-left mt-4">
          Remembered your password?{" "}
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Login
          </Link>
        </span>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
