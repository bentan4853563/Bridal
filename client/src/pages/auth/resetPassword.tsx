import React, { useState } from "react";
import { TextField, Button, Typography, Container, Paper } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../actions/auth"; // Implement this action
import { toast } from "react-toastify";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate()
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      resetPassword(token, password) // Here token could be undefined
        .then(() => {
          toast.success("Password has been reset successfully");
          navigate('/')
        })
        .catch((error) => setMessage(error.message));
    } else {
      setMessage("Token is missing");
    }
  };

  return (
    <Container maxWidth="sm" className="mt-72">
      <Paper elevation={2} className="p-10 flex flex-col">
        <Typography variant="h5" component="h1" className="text-left">
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="dense"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            Reset Password
          </Button>
        </form>
        <Link to="/" className="text-blue-600 hover:text-blue-800 mt-2 text-left">Return to login?</Link>
        {message && <Typography className="mt-4">{message}</Typography>}
      </Paper>
    </Container>
  );
};

export default ResetPassword;
