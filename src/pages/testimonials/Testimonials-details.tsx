import React, { useState, useEffect } from "react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import BackArrow from "../../components/common/BackArrow";
import {
  createTestimonial,
  updateTestimonial,
  getTestimonialById,
} from "../../api/tesstimonial";

interface TestimonialFormData {
  _id?: string;
  name: string;
  ratings: number;
  description: string;
}

const TestimonialsDetails = () => {
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: "",
    ratings: 5,
    description: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  
  // Fetch testimonial data if editing
  useEffect(() => {
    const fetchTestimonial = async () => {
      if (id && id !== ":id" && id !== "new") {
        setIsLoading(true);
        setIsEdit(true);

        try {
          // Use the API function to get the testimonial
          const response = await getTestimonialById(id);

          if (response && response.data) {
            setFormData({
              _id: response.data._id,
              name: response.data.name,
              ratings: response.data.ratings || response.data.rating,
              description: response.data.description,
            });
          }
        } catch (error) {
          console.error("Error fetching testimonial:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (location.state?.testimonial) {
        // Handle case when testimonial data is passed via location state
        const { testimonial } = location.state;
        setIsEdit(true);
        setFormData({
          _id: String(testimonial._id || testimonial.id),
          name: testimonial.name,
          ratings: testimonial.ratings || testimonial.rating,
          description: testimonial.description,
        });
      }
    };

    fetchTestimonial();
  }, [id, location.state]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRatingChange = (
    _: React.SyntheticEvent,
    newValue: number | null
  ) => {
    setFormData((prev) => ({ ...prev, ratings: newValue || 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;

      if (isEdit) {
        // Update existing testimonial
        response = await updateTestimonial(formData);
      } else {
        // Create new testimonial
        response = await createTestimonial(formData);
      }

      console.log(
        `Testimonial ${isEdit ? "updated" : "created"} successfully:`,
        response
      );

      // Navigate back to testimonials list
      setTimeout(() => {
        setIsLoading(false);
        navigate("/testimonials");
      }, 500);
    } catch (error) {
      console.error(
        `Error ${isEdit ? "updating" : "creating"} testimonial:`,
        error
      );
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/testimonials");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "white",
        borderRadius: "8px",
      }}
    >
      {/* Top section - fixed */}
      <Box
        sx={{
          padding: 2,
          boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "white",
        }}
      >
        <BackArrow />
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
          paddingBottom: "80px", // Add extra padding at the bottom to prevent overlap
          scrollbarWidth: "none", // For Firefox
          "&::-webkit-scrollbar": {
            display: "none", // For Chrome, Safari, and Opera
          },
        }}
      >
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
                value={formData.name}
                onChange={handleInputChange}
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
                  value={formData.ratings}
                  onChange={handleRatingChange}
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
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
        </form>
      </Box>

      {/* Bottom section - fixed with increased bottom spacing */}
      <Box
        sx={{
          padding: 3, // Increased padding
          paddingBottom: 4, // Extra bottom padding
          boxShadow: "0px -2px 4px rgba(0,0,0,0.05)",
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          bgcolor: "white",
        }}
      >
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="bg-gray-500 text-white w-24 py-2 rounded uppercase text-sm hover:bg-gray-600 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            onClick={handleBack}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white w-24 py-2 rounded uppercase text-sm hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isEdit ? "Update" : "Add"}
          </button>
        </div>
      </Box>
    </Box>
  );
};

export default TestimonialsDetails;
