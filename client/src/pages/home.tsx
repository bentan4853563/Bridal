import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import logo from "../assets/logo_black.png";

const Home: React.FC = () => {
  return (
    <div className="w-full p-5 flex flex-col items-end">
      <div className="w-5/12 mx-auto">
        <img src={logo} alt="logo" />
        <Link to="/" className="text-black text-right">
          <Button variant="contained" endIcon={<SendIcon />}>
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
