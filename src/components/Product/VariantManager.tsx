import React, { useEffect } from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { VariantComponent } from "./Variant";

export // Update your Variant type to include optionIds
interface Variant {
  id: string;
  optionName: string;
  optionValues: string[];
  optionIds?: string[]; // Add this field to store variant IDs
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
      id: `variant-${Date.now()}`, // Ensure unique ID
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
        variant.id === updatedVariant.id ? { ...updatedVariant } : variant
      )
    );
  };

  // Log the variants whenever they change
  useEffect(() => {
    console.log("Current variants:", variants);
  }, [variants]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Map variants to the VariantComponent */}
      {variants.map((variant) => (
        <VariantComponent
          key={variant.id}
          variant={variant}
          onDelete={() => deleteVariant(variant.id)}
          onComplete={completeVariant}
        />
      ))}

      {/* Add variants button */}
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
