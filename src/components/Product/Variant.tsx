import React, { useState, useRef, KeyboardEvent, useEffect } from "react";
import {
  TextField,
  Typography,
  Box,
  Button,
  Stack,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  Alert,
  Collapse,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

// Export the Variant interface to match the one in VariantManager
export // Update your Variant type to include optionIds
interface Variant {
  id: string;
  optionName: string;
  optionValues: string[];
  optionIds?: string[]; // Add this field to store variant IDs
  isComplete: boolean;
}

// VariantComponent to manage a single variant
export const VariantComponent: React.FC<{
  variant: Variant;
  onDelete: () => void;
  onComplete: (variant: Variant) => void;
}> = ({ variant, onDelete, onComplete }) => {
  const [optionName, setOptionName] = useState<string>(variant.optionName);
  const [optionValues, setOptionValues] = useState<string[]>(
    variant.optionValues
  );
  const [currentValue, setCurrentValue] = useState<string>("");
  const [isComplete, setIsComplete] = useState<boolean>(variant.isComplete);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Update component state when variant props change, but only when the ID changes
  // This prevents overriding local state during edits
  useEffect(() => {
    setOptionName(variant.optionName);
    setOptionValues([...variant.optionValues]);
    setIsComplete(variant.isComplete);
  }, [variant.id]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentValue.trim() !== "") {
      addCurrentValue();
    }
  };

  const addCurrentValue = () => {
    if (currentValue.trim() !== "") {
      const updatedValues = [...optionValues, currentValue.trim()];
      setOptionValues(updatedValues);
      setCurrentValue("");
      console.log(
        `Added value: ${currentValue.trim()} to variant ${variant.id}`
      );

      // Focus back on the input after adding a value
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleComplete = () => {
    console.log(`Attempting to complete variant ${variant.id}`);

    // First add the current value if it exists
    let finalValues = [...optionValues];
    if (currentValue.trim() !== "") {
      finalValues = [...optionValues, currentValue.trim()];
      setOptionValues(finalValues);
    }

    if (optionName.trim() === "" && finalValues.length === 0) {
      setAlertMessage("Please enter both Option Name and Option Values");
      setShowAlert(true);
      console.log("Completion failed: Missing option name and values");
    } else if (optionName.trim() === "") {
      setAlertMessage("Please enter an Option Name");
      setShowAlert(true);
      console.log("Completion failed: Missing option name");
    } else if (finalValues.length === 0) {
      setAlertMessage("Please add at least one Option Value");
      setShowAlert(true);
      console.log("Completion failed: No option values");
    } else {
      // Valid input - proceed with completion
      const updatedVariant = {
        ...variant,
        optionName,
        optionValues: finalValues,
        isComplete: true,
      };
      setIsComplete(true);
      setCurrentValue("");
      setShowAlert(false);
      onComplete(updatedVariant);
      console.log("Variant completed successfully", updatedVariant);
    }
  };

  const handleDeleteValue = (index: number) => {
    const valueToDelete = optionValues[index];
    const newValues = [...optionValues];
    newValues.splice(index, 1);
    setOptionValues(newValues);
    console.log(`Deleted value: ${valueToDelete} from variant ${variant.id}`);
  };

  // Function to handle edit mode
  const handleEdit = () => {
    console.log(`Editing variant: ${variant.id}`);
    setIsComplete(false);
    // Explicitly notify parent that this variant is being edited
    onComplete({
      ...variant,
      optionName,
      optionValues,
      isComplete: false,
    });
  };

  // Determine if the Done button should be enabled
  const isDoneButtonEnabled = () => {
    return (
      optionName.trim() !== "" &&
      (optionValues.length > 0 || currentValue.trim() !== "")
    );
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      {!isComplete ? (
        <>
          <Collapse in={showAlert}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setShowAlert(false)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              {alertMessage}
            </Alert>
          </Collapse>

          <Typography variant="subtitle1" gutterBottom align="left">
            Option Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={optionName}
            onChange={(e) => {
              setOptionName(e.target.value);
              console.log(
                `Option name changed to: ${e.target.value} for variant ${variant.id}`
              );
            }}
            placeholder="Size/Color"
            sx={{ mb: 2 }}
            disabled={isComplete}
            error={showAlert && optionName.trim() === ""}
          />

          <Typography variant="subtitle1" gutterBottom align="left">
            Option Values
          </Typography>
          {optionValues.map((value, index) => (
            <Box key={`${variant.id}-value-${index}`} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                value={value}
                onChange={(e) => {
                  const newValues = [...optionValues];
                  newValues[index] = e.target.value;
                  setOptionValues(newValues);
                  console.log(
                    `Modified value at index ${index} to: ${e.target.value} for variant ${variant.id}`
                  );
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteValue(index)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          ))}
          <Box sx={{ display: "flex", mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              placeholder="Add Value"
              inputRef={inputRef}
              onKeyDown={handleKeyDown}
              error={
                showAlert &&
                optionValues.length === 0 &&
                currentValue.trim() === ""
              }
              sx={{ mr: 1 }}
            />
            <Button
              variant="outlined"
              onClick={addCurrentValue}
              disabled={currentValue.trim() === ""}
              sx={{
                minWidth: "80px",
                color: "var(--secondary-color)",
                borderColor: "var(--secondary-color)",
              }}
            >
              Add
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Press Enter after typing a value or click Add
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => {
                console.log(`Deleting variant: ${variant.id}`);
                onDelete();
              }}
              sx={{
                mr: 1,
                color: "var(--secondary-color)",
                borderColor: "var(--secondary-color)",
              }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              onClick={handleComplete}
              disabled={!isDoneButtonEnabled()}
              sx={{
                backgroundColor: "var(--secondary-color)",
                "&:hover": {
                  backgroundColor:
                    "var(--secondary-color-dark, var(--secondary-color))",
                },
              }}
            >
              Done
            </Button>
          </Box>
        </>
      ) : (
        <Box>
          <Typography
            variant="subtitle1"
            gutterBottom
            align="left"
            fontWeight="bold"
          >
            {optionName}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {optionValues.map((value, index) => (
              <Chip
                key={`${variant.id}-chip-${index}`}
                label={value}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                mr: 1,
                color: "var(--secondary-color)",
                borderColor: "var(--secondary-color)",
                "&:hover": {
                  borderColor: "var(--secondary-color)",
                  backgroundColor: "rgba(var(--secondary-color-rgb), 0.04)",
                },
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => {
                console.log(`Deleting completed variant: ${variant.id}`);
                onDelete();
              }}
              sx={{
                color: "var(--secondary-color)",
                borderColor: "var(--secondary-color)",
                "&:hover": {
                  borderColor: "var(--secondary-color)",
                  backgroundColor: "rgba(var(--secondary-color-rgb), 0.04)",
                },
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};
