import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

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
    <div className="bg-white p-4 rounded-lg shadow mb-4 h-screen flex justify-center">
      <div className="w-full text-left max-w-md mt-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              NAME <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              placeholder="Name"
              className="w-full text-border input-box p-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="ratings" className="block mb-1 font-medium">
              RATINGS <span className="text-red-500">*</span>
            </label>
            <Box className="p-2 border input-box rounded bg-white">
              <Rating
                name="ratings"
                value={rating}
                onChange={(_, newValue) => {
                  setRating(newValue || 0); // Handle null case by defaulting to 0
                }}
                precision={1}
              />
            </Box>
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 font-medium">
              DESCRIPTION <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="description"
              placeholder="Description"
              className="w-full p-2 input-box border rounded"
              required
            />
          </div>

          <div className="flex justify-center space-x-4 mt-4">
            <button
              type="button"
              className="text-white px-4 py-2 rounded uppercase text-sm"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              onClick={handleBack}
              className="text-white px-4 py-2 rounded uppercase text-sm"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialsDetails;
