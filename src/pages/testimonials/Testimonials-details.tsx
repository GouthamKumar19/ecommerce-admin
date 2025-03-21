import React, { useState, useEffect, useContext } from "react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import { ActionContext } from "../../context/ActionContext";
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
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    name: false,
    description: false,
  });
  const { setActionHandlers } = useContext(ActionContext);

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

  // Set up action handlers for the ActionBox component
  useEffect(() => {
    setActionHandlers({
      onConfirm: handleSubmit,
      onCancel: handleBack,
    });

    // Cleanup function to reset handlers when component unmounts
    return () => {
      setActionHandlers({
        onConfirm: () => console.warn("onConfirm is not implemented"),
        onCancel: () => console.warn("onCancel is not implemented"),
      });
    };
  }, [formData, isEdit, isLoading, setActionHandlers]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: false }));
  };

  const handleRatingChange = (
    _: React.SyntheticEvent,
    newValue: number | null
  ) => {
    setFormData((prev) => ({ ...prev, ratings: newValue || 0 }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validation check
    const newErrors: { [key: string]: boolean } = {};
    newErrors.name = !formData.name;
    newErrors.description =
      !formData.description || formData.description.length > 100;

    if (newErrors.name || newErrors.description) {
      setErrors(newErrors);
      return;
    }

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
              <TextField
                id="name"
                label="Name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                fullWidth
                variant="outlined"
                margin="normal"
                error={errors.name}
                helperText={errors.name ? "Name is required" : ""}
              />
            </div>

            {/* Rating Section */}
            <div>
              <label
                htmlFor="ratings"
                className="block mb-1 font-medium text-gray-700"
              >
                Ratings <span className="text-red-500">*</span>
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
            <TextField
              id="description"
              label="Description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              required
              fullWidth
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
              inputProps={{ maxLength: 100 }}
              error={errors.description}
              helperText={
                errors.description
                  ? "Description is required and must be less than 100 characters"
                  : `${formData.description.length}/100`
              }
            />
          </div>
        </form>
      </Box>

      {/* Bottom section with ActionBox component */}
      <Box
        sx={{
          padding: 3,
          paddingBottom: 4,
          boxShadow: "0px -2px 4px rgba(0,0,0,0.05)",
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          bgcolor: "white",
        }}
      >
        <ActionBox
          cancelText="Cancel"
          confirmText={isEdit ? "Update" : "Add"}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default TestimonialsDetails;
