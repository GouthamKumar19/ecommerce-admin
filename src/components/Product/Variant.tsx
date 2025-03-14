import React, { useState, useRef, KeyboardEvent } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

// Export the Variant interface so it can be imported in ProductForm
export interface Variant {
  id: string;
  optionName: string;
  optionValues: string[];
  isComplete: boolean;
}

interface VariantManagerProps {
  initialVariants?: Variant[];
}

// This is the main component that will manage all variants
const VariantManager: React.FC<VariantManagerProps> = ({
  initialVariants = [],
}) => {
  const [variants, setVariants] = useState<Variant[]>(initialVariants);

  const addNewVariant = () => {
    const newVariant: Variant = {
      id: `variant-${Date.now()}`,
      optionName: "",
      optionValues: [],
      isComplete: false,
    };
    setVariants([...variants, newVariant]);
  };

  const handleDeleteVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleCompleteVariant = (updatedVariant: Variant) => {
    setVariants(
      variants.map((v) => (v.id === updatedVariant.id ? updatedVariant : v))
    );
  };

  // Group variants by completion status
  const completedVariants = variants.filter((v) => v.isComplete);
  const incompleteVariants = variants.filter((v) => !v.isComplete);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Display completed variants first */}
      {completedVariants.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {completedVariants.map((variant) => (
            <VariantComponent
              key={variant.id}
              variant={variant}
              onDelete={() => handleDeleteVariant(variant.id)}
              onComplete={(updatedVariant) =>
                handleCompleteVariant(updatedVariant)
              }
            />
          ))}
        </Box>
      )}

      {/* Add variants label - updated to use the secondary color */}
      <Typography
        gutterBottom
        sx={{
          mt: 3,
          mb: 1,
          color: "var(--secondary-color)",
          background: "var(--secondary-color)",
        }}
        fontWeight="medium"
      >
        Add variants like size and color
      </Typography>

      {/* Display incomplete variants */}
      {incompleteVariants.map((variant) => (
        <VariantComponent
          key={variant.id}
          variant={variant}
          onDelete={() => handleDeleteVariant(variant.id)}
          onComplete={(updatedVariant) => handleCompleteVariant(updatedVariant)}
        />
      ))}

      {/* Add variant button - updated to ensure it uses the secondary color */}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={addNewVariant}
        sx={{
          mt: 2,
          color: "var(--secondary-color)",
          borderColor: "var(--secondary-color)",
          "&:hover": {
            borderColor: "var(--secondary-color)",
            backgroundColor: "rgba(var(--secondary-color-rgb), 0.04)",
          },
        }}
      >
        Add Option
      </Button>
    </Box>
  );
};

// VariantComponent updated to use the secondary color for relevant elements
const VariantComponent: React.FC<{
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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentValue.trim() !== "") {
      setOptionValues([...optionValues, currentValue.trim()]);
      setCurrentValue("");

      // Focus back on the input after adding a value
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleComplete = () => {
    if (optionName.trim() !== "" && optionValues.length > 0) {
      const updatedVariant = {
        ...variant,
        optionName,
        optionValues,
        isComplete: true,
      };
      setIsComplete(true);
      onComplete(updatedVariant);
    }
  };

  const handleDeleteValue = (index: number) => {
    const newValues = [...optionValues];
    newValues.splice(index, 1);
    setOptionValues(newValues);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      {!isComplete ? (
        <>
          <Typography variant="subtitle1" gutterBottom align="left">
            Option Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={optionName}
            onChange={(e) => setOptionName(e.target.value)}
            placeholder="Size"
            sx={{ mb: 2 }}
            disabled={isComplete}
          />

          <Typography variant="subtitle1" gutterBottom align="left">
            Option Values
          </Typography>
          {optionValues.map((value, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                value={value}
                onChange={(e) => {
                  const newValues = [...optionValues];
                  newValues[index] = e.target.value;
                  setOptionValues(newValues);
                }}
                onKeyDown={handleKeyDown}
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
          <TextField
            fullWidth
            size="small"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder="Add Value"
            inputRef={inputRef}
            onKeyDown={handleKeyDown}
            helperText="Press Enter after each value"
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={onDelete}
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
              disabled={optionName.trim() === "" || optionValues.length === 0}
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
              <Chip key={index} label={value} sx={{ mb: 1 }} />
            ))}
          </Stack>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={onDelete}
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

export { VariantComponent, VariantManager };
export default VariantManager;
