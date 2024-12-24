import React, { useState } from "react";
import { TextField, Button, Typography, Container, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import {handleSignup} from '../../actions/auth'

const Signup: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    handleSignup(email, password, () => {
      navigate('/')
    })    
  };

  return (
    <Container
      maxWidth="sm"
      className="md:h-[100vh] p-10  flex flex-col justify-center"
    >
      <Paper elevation={2} className="w-full p-10 flex flex-col justify-center">
        <Typography variant="h5" component="h1" className="text-start mb-2">
          Sign Up to Bridal
        </Typography>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              size="small"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              size="small"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              size="small"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
        </form>

        <span className="text-left mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Login
          </Link>
        </span>
      </Paper>
    </Container>
  );
};

export default Signup;
