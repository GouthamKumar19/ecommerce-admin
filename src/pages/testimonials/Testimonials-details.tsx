import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackButton from "../../components/common/ArrowBackButton"; // Adjust the path as needed

const TestimonialsDetails = () => {
  const [rating, setRating] = useState<number>(4);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally, you'd handle form data submission here
    navigate("/testimonials"); // Navigate to testimonials page on submit
  };

  // Changed to navigate back to previous page in history
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="text-left bg-white p-4 rounded-lg shadow h-screen">
      {/* Fixed Back Button */}
      <div className="flex justify-between items-center mb-4 bg-white">
        <div className="flex items-center">
          <ArrowBackButton onClick={handleBack} />
          <p className="text-green-600 ml-2 text-lg font-bold">
            ADD TESTIMONIALS
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="pl-40">
        <form className="w-full max-w-3xl space-y-4" onSubmit={handleSubmit}>
          {/* Grid container for name and rating */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Section */}
            <div>
              <label
                htmlFor="name"
                className="block mb-1 font-medium text-gray-700"
              >
                NAME <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                placeholder="Name"
                className="w-full h-11 text-border input-box px-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            {/* Rating Section */}
            <div>
              <label
                htmlFor="ratings"
                className="block mb-1 font-medium text-gray-700"
              >
                RATINGS <span className="text-red-500">*</span>
              </label>
              <Box className="h-11 px-3 border input-box rounded bg-white flex items-center">
                <Rating
                  name="ratings"
                  value={rating}
                  onChange={(_, newValue) => {
                    setRating(newValue || 0);
                  }}
                  precision={1}
                  size="medium"
                />
              </Box>
            </div>
          </div>

          {/* Description Section with Textarea */}
          <div className="mt-4">
            <label
              htmlFor="description"
              className="block mb-1 font-medium text-gray-700"
            >
              DESCRIPTION <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              placeholder="Description"
              className="w-full px-3 py-2 input-box border rounded min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* Submit Buttons */}
          <div className="sticky bottom-0 bg-white py-2">
            <div className="flex justify-end space-x-4">
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{
                  borderColor: "#0d7f3f",
                  color: "#0d7f3f",
                  width: "96px",
                  mr: 2,
                  "&:hover": {
                    borderColor: "grey.700",
                    backgroundColor: "grey.50",
                  },
                }}
              >
                CANCEL
              </Button>

              <Button
                type="submit" // Changed to "submit" to properly handle the form submission
                variant="contained"
                sx={{
                  bgcolor: "var(--secondary-color, #4CAF50)",
                  color: "white",
                  width: "96px",
                  "&:hover": {
                    bgcolor: "var(--secondary-dark-color, #388E3C)",
                  },
                }}
              >
                ADD
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialsDetails;
