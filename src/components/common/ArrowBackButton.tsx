import React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ArrowBackButtonProps {
  onClick: () => void;
}

const ArrowBackButton: React.FC<ArrowBackButtonProps> = ({ onClick }) => {
  return (
    <div style={{ marginBottom: "12px", textAlign: "left" }}>
      <IconButton
        onClick={onClick}
        style={{ position: "relative", left: "0px" }}
      >
        <ArrowBackIcon />
      </IconButton>
    </div>
  );
};          

export default ArrowBackButton;
