import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email] = useState("abc@gmail.com");
  const [showEmailAlert, setShowEmailAlert] = useState(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleMouseEnter = () => {
    setShowEmailAlert(true);
  };

  const handleMouseLeave = () => {
    setShowEmailAlert(false);
  };

  //   const handleSaveClick = () => {
  //     console.log("Saving profile:", { name, email });
  //   };

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-center text-3xl font-bold mb-8 text-green-600">
        Profile
      </h2>

      <div className="mb-6">
        <label className="block text-gray-700 text-lg font-medium mb-2 text-left">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Name"
          className="shadow border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-8">
        <label className="block text-gray-700 text-lg font-medium mb-2 text-left">
          Email
        </label>
        <div className="relative flex items-center">
          <input
            type="email"
            value={email}
            readOnly
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="shadow border rounded w-full py-3 px-3 text-gray-500 bg-gray-100 cursor-not-allowed"
          />
          {showEmailAlert && (
            <div className="absolute right-0 transform translate-x-full ml-10 bg-red-100 text-red-700 px-3 py-1 rounded shadow-md text-sm">
              Cannot edit this field
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleBackClick}
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-8 rounded"
        >
          SAVE
        </button>
        <button
          onClick={handleBackClick}
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-8 rounded"
        >
          BACK
        </button>
      </div>
    </div>
  );
};

export default Profile;
