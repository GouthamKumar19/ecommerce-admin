import React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
// import { clear } from "console";

interface SearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchValue,
  onSearchChange,
}) => {
  const handleClear = () => {
    onSearchChange("");
  };
  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 400,
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      {/* Input Field */}
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        inputProps={{ "aria-label": "search" }}
      />

      {searchValue.length > 0 && (
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={handleClear}
        >
          <CloseIcon />
        </IconButton>
      )}

      {/* Search Icon */}

      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
