import React from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { VariantComponent } from "./Variant";

export interface Variant {
  id: string;
  optionName: string;
  optionValues: string[];
  isComplete: boolean;
}

interface VariantManagerProps {
  variants: Variant[];
  setVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
}

const VariantManager: React.FC<VariantManagerProps> = ({
  variants,
  setVariants,
}) => {
  // Functions to handle variants
  const addVariant = () => {
    const newVariant: Variant = {
      id: `variant-${Date.now()}`,
      optionName: "",
      optionValues: [],
      isComplete: false,
    };
    setVariants([...variants, newVariant]);
  };

  const deleteVariant = (id: string) => {
    setVariants(variants.filter((variant) => variant.id !== id));
  };

  const completeVariant = (updatedVariant: Variant) => {
    setVariants(
      variants.map((variant) =>
        variant.id === updatedVariant.id ? updatedVariant : variant
      )
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
              onDelete={() => deleteVariant(variant.id)}
              onComplete={completeVariant}
            />
          ))}
        </Box>
      )}

      {/* Display incomplete variants */}
      {incompleteVariants.map((variant) => (
        <VariantComponent
          key={variant.id}
          variant={variant}
          onDelete={() => deleteVariant(variant.id)}
          onComplete={completeVariant}
        />
      ))}

      {/* Add variants button now appears below all variants */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-start" }}>
        <Button
          startIcon={<AddIcon />}
          onClick={addVariant}
          sx={{
            color: "var(--secondary-color)",
            textAlign: "left",
            padding: "6px 8px",
            minWidth: "auto",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
          variant="text"
        >
          Add variants like size and color
        </Button>
      </Box>
    </Box>
  );
};

export default VariantManager;
