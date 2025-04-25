import React, { useState, useEffect, useContext } from "react";
import { Rating, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
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
    ratings: 0,
    description: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    name: false,
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
          const response = await getTestimonialById(id);

          if (response && response.data) {
            setFormData({
              _id: response.data._id,
              name: response.data.name,
              ratings: response.data.ratings || response.data.rating,
              description: response.data.description,
            });
            // Validate name after loading
            validateName(response.data.name);
          }
        } catch (error) {
          console.error("Error fetching testimonial:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (location.state?.testimonial) {
        const { testimonial } = location.state;
        setIsEdit(true);
        setFormData({
          _id: String(testimonial._id || testimonial.id),
          name: testimonial.name,
          ratings: testimonial.ratings || testimonial.rating,
          description: testimonial.description,
        });
        // Validate name after loading
        validateName(testimonial.name);
      }
    };

    fetchTestimonial();
  }, [id, location.state]);

  useEffect(() => {
    setActionHandlers({
      onConfirm: handleSubmit,
      onCancel: handleBack,
    });

    return () => {
      setActionHandlers({
        onConfirm: () => console.warn("onConfirm is not implemented"),
        onCancel: () => console.warn("onCancel is not implemented"),
      });
    };
  }, [formData, isEdit, isLoading, setActionHandlers]);

  // Separate validation function for reuse
  const validateName = (value: string): string | null => {
    const regex = /^[a-zA-Z. ]*$/; // Allow alphabet characters, spaces and periods

    if (value.trim().length === 0) {
      return "Name is required.";
    } else if (!regex.test(value.trim())) {
      return "Name can only contain letters and periods.";
    } else if (value.trim().length < 2) {
      return "Name must be at least 2 characters.";
    }
    return null;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Handle name validation in real-time
    if (id === "name") {
      setNameError(validateName(value));
      // Mark field as touched
      if (!touched.name) {
        setTouched((prev) => ({ ...prev, name: true }));
      }
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    // Mark field as touched on blur
    if (id === "name" && !touched.name) {
      setTouched((prev) => ({ ...prev, name: true }));
      setNameError(validateName(value));
    }
  };

  const handleRatingChange = (
    _: React.SyntheticEvent,
    newValue: number | null
  ) => {
    setFormData((prev) => ({ ...prev, ratings: newValue || 0 }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Mark name as touched to show validation errors if any
    setTouched({ ...touched, name: true });

    // Validate name before submission
    const currentNameError = validateName(formData.name);
    setNameError(currentNameError);

    // Check if name is valid before proceeding
    if (currentNameError) {
      return;
    }

    setIsLoading(true);

    try {
      let response;

      if (isEdit) {
        response = await updateTestimonial(formData);
      } else {
        response = await createTestimonial(formData);
      }

      console.log(
        `Testimonial ${isEdit ? "updated" : "created"} successfully:`,
        response
      );

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

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#0d7f3f" }} />
      </Box>
    );
  }

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
          paddingBottom: "80px",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <form className="w-full max-w-3xl space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-black text-small font-medium mb-2 text-left">
                Name
              </label>
              <TextField
                id="name"
                variant="outlined"
                placeholder="Name"
                fullWidth
                size="small"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(nameError)}
                helperText={touched.name ? nameError : ""}
                required
              />
            </div>

            <div>
              <label className="block text-black text-small font-medium mb-2 text-left">
                Ratings
              </label>
              <Box className="h-11 px-3 border border-grey-300 rounded bg-white flex items-center">
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

          <div className="mt-4">
            <label className="block text-black text-small font-medium mb-2 text-left">
              Description
            </label>
            <TextField
              id="description"
              placeholder="Description"
              variant="outlined"
              fullWidth
              size="small"
              multiline
              rows={4}
              maxRows={4}
              value={formData.description}
              onChange={handleInputChange}
              inputProps={{ maxLength: 120 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "14px",
                      margin: 0,
                    }}
                  >
                    {formData.description.length}/120
                  </InputAdornment>
                ),
              }}
              required
            />
          </div>
        </form>
      </Box>

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
