import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Paper } from "@mui/material";
import { handleLogin } from "../../actions/auth";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    handleLogin(email, password, () => {
      navigate("/dashboard");
    });
  };

  return (
    <Container
      maxWidth="sm"
      className="md:h-[100vh] p-10  flex flex-col justify-center"
    >
      <Paper elevation={2} className="w-full p-10 flex flex-col justify-center">
        <Typography variant="h5" component="h1" className="text-left">
          Login to Bridal
        </Typography>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* Forgot Password Link */}
          <span className="text-left">
            Forgot your password?{" "}
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:text-blue-800"
            >
              Reset it here
            </Link>
          </span>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            Login
          </Button>
        </form>

        <span className="text-left mt-4">
          No Bridal account yet?{" "}
          <Link to="/signup" className="text-blue-600 hover:text-blue-800">
            Create an account
          </Link>
        </span>
      </Paper>
    </Container>
  );
};

export default Login;
