import { useEffect, useContext, useState } from "react";
import { Box } from "@mui/material";
import UserDetailsForm from "../../components/userDetails/UserDetails";
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import { ActionContext } from "../../context/ActionContext";
import { useParams, useNavigate } from "react-router-dom";
import { User, AddressData } from "../../types/users.types";

import {
  createUser,
  updateUser,
  getUserById,
  createAddress,
  updateUserAddresses
} from "../../api/user";


export const UserDetailsPage = () => {
  const { setActionHandlers } = useContext(ActionContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Snackbar state
  const [, setOpenSnackbar] = useState(false);
  const [, setSnackbarMessage] = useState("");
  const [, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // Check if we're in edit mode and fetch user data if needed
useEffect(() => {
  const fetchUser = async () => {
    if (id && id !== "new") {
      setIsEdit(true);
      setIsLoading(true);

      try {
        const response = await getUserById(id);
        if (response.status === 200 && response.data) {
          // Store the response in an array and log it
          const userArray = [response.data];
          console.log("Fetched user data array:", userArray);

          setUserData(response.data);
        } else {
          setSnackbarMessage("Failed to load user data. Please try again.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setSnackbarMessage("An error occurred while fetching user data.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  fetchUser();
}, [id]);

  // Helper function to create addresses after user creation/update
  // Modified function to send addresses in an array
 const createAddressesForUser = async (
  userId: string,
  addresses: AddressData[]
) => {
  try {
    // Transform addresses to the format expected by the API
    const addressPayloads = addresses.map(address => ({
      userId: userId,
      line1: address.addressLine1,
      line2: address.addressLine2,
      city: address.city,
      state: address.state,
      pinCode: address.pinCode,
      isShipping: address.useAsShipping || false,
    }));

    // Send all addresses in a single request - pass the array directly
    const response = await createAddress(addressPayloads);

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to create addresses");
    }
    
    return true;
  } catch (error) {
    console.error("Error creating addresses:", error);
    return false;
  }
};

  // Handle form submission from the child component
  const handleSaveUser = async (formData: any) => {
    setIsLoading(true);

    try {
      // Extract addresses from formData to handle separately
      const { addresses, ...userData } = formData;
      let response;
      let userId;

      if (isEdit && id) {
        // Update existing user
        response = await updateUser(id, userData);
        userId = id;
        
        // Update addresses if they exist
        if (addresses && addresses.length > 0) {
          // Filter addresses that have an _id (existing addresses)
          const addressesToUpdate = addresses
            .filter((address: AddressData) => address._id)
            .map((address: AddressData) => ({
              _id: address._id,
              line1: address.addressLine1,
              line2: address.addressLine2 || "",
              city: address.city,
              state: address.state,
              pinCode: address.pinCode,
              isShipping: address.useAsShipping || false
            }));
            
          if (addressesToUpdate.length > 0) {
            console.log("Updating addresses:", addressesToUpdate);
            const updateResponse = await updateUserAddresses(addressesToUpdate);
            
            if (updateResponse.status === 200) {
              console.log("Addresses updated successfully:", updateResponse);
            } else {
              throw new Error("Failed to update addresses");
            }
          }
          
          // Handle new addresses (without _id) by creating them
          const newAddresses = addresses.filter((address: AddressData) => !address._id);
          if (newAddresses.length > 0) {
            const addressSuccess = await createAddressesForUser(userId, newAddresses);
            if (!addressSuccess) {
              setSnackbarMessage("Some new addresses could not be created.");
              setSnackbarSeverity("error");
              setOpenSnackbar(true);
            }
          }
        }
      } else {
        // Create new user
        response = await createUser(userData);

        // Extract user ID from response - ensure we're getting the correct property
        // Fix: Type the response data correctly
        if (
          response?.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const userData = response.data[0] as User;
          userId = userData._id;
        } else if (response?.data && typeof response.data === "object") {
          // Handle case where response.data might be a single object
          const userData = response.data as User;
          userId = userData._id;
        }

        if (!userId) {
          throw new Error("Failed to retrieve user ID after creation.");
        }

        console.log("Created user with ID:", userId); // Log for debugging

        // Immediately create addresses after user creation
        if (addresses && addresses.length > 0) {
          console.log("Creating addresses for user:", userId, addresses); // Debug log

          const addressSuccess = await createAddressesForUser(
            userId,
            addresses
          );

          if (!addressSuccess) {
            setSnackbarMessage(
              "User created but there was an issue with saving addresses."
            );
            //setSnackbarSeverity("warning");
            setOpenSnackbar(true);
            // Still navigate back after delay
            setTimeout(() => {
              navigate("/users");
            }, 1500);
            return;
          }
        }
      }

      if (response.status === 200 || response.status === 201) {
        setSnackbarMessage(
          isEdit ? "User updated successfully" : "User created successfully"
        );
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        // Navigate back after short delay
        setTimeout(() => {
          navigate("/users");
        }, 1500);
      } else {
        throw new Error(response.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting user data:", error);
      setSnackbarMessage(
        error instanceof Error ? error.message : "Failed to save user"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up action handlers for the ActionBox component
  useEffect(() => {
    setActionHandlers({
      onConfirm: () => {
        // This will trigger the onSave prop in the child component
        // The actual data is passed from the child to parent when this is called
        document.dispatchEvent(new Event("triggerSaveFromParent"));
      },
      onCancel: handleCancel,
    });

    return () => {
      setActionHandlers({
        onConfirm: () => console.warn("onConfirm is not implemented"),
        onCancel: () => console.warn("onCancel is not implemented"),
      });
    };
  }, [setActionHandlers]);

  const handleCancel = () => {
    navigate("/users");
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

      {/* Middle section - scrollable with padding at bottom to prevent content overlap */}
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
        <UserDetailsForm
          userData={userData}
          isLoading={isLoading}
          onSave={handleSaveUser}
          isEditMode={isEdit}
        />
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

      {/* Removed Snackbar component */}
    </Box>
  );
};

export default UserDetailsPage;
