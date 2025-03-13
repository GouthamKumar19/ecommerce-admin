
import UserDetailsForm from "../../components/userDetails/UserDetails";
import ArrowBackButton from "../../components/common/ArrowBackButton";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

export const UserDetailsPage = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleCancel = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 h-screen">
      <div
        style={{
          display: "flex", // Use flex to align items horizontally
          justifyContent: "space-between",
          alignItems: "center",
          background: "white",
          marginBottom: "20px",
        }}
      >
        {/* Fixed ArrowBackButton and title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "8px",
              borderRadius: "4px",
              height: "50px",
            }}
          >
            {/* Pass the handleCancel function to the ArrowBackButton */}
            <ArrowBackButton onClick={handleCancel} />
          </div>

          {/* Space after back arrow button and the title */}
          <p
            style={{
              color: "#0d7f3f",
              marginLeft: "10px",
              fontSize: "20px",
              fontWeight: "bold",
              marginTop: "8px",
            }}
          >
            ADD NEW USERS
          </p>
        </div>
      </div>

      {/* User Details Form Component */}
      <UserDetailsForm />

      {/* Additional components (if necessary) can be added here */}
    </div>
  );
};
