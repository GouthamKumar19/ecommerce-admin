import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const TestimonialsDetails = () => {
  const [rating, setRating] = useState<number>(4);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/testimonials");
  };

  const handleBack = () => {
    navigate("/testimonials");
  };

  return (
    <div className=" text-left bg-white p-4 rounded-lg shadow h-screen">
      {/* Back Button */}
      <div className="mb-4 text-left">
        <IconButton
          onClick={handleBack}
          className="text-gray-700"
          style={{
            position: "relative",
            left: "0px",
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </div>

      {/* Form */}
      <div className="pl-1">
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
        </form>
        <div className="sticky bottom-0 bg-white py-2">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-500 text-white w-24 py-2 rounded uppercase text-sm hover:bg-gray-600 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={handleBack}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white w-24 py-2 rounded uppercase text-sm hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleSubmit}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsDetails;
