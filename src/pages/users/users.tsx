import  { useState } from "react";
import DataTable from "../../components/common/DataTable";
import { items } from "../../config/mock/userTable";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/common/SearchBar"; // Import the SearchBar component

const UsersPage = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const navigate = useNavigate();

  const columns = [
    {
      header: "Name",
      key: "name",
    },
    {
      header: "Email",
      key: "email",
    },
    {
      header: "Phone",
      key: "phone",
    },
    {
      header: "Actions",
      key: "actions",
    },
  ];

  const handleAddNewUser = () => {
    // Navigate to the user details page for creating a new user
    navigate("/users/new");
  };

  return (
    <div>
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex justify-center w-full md:w-auto flex-grow">
            {/* Use the SearchBar component */}
            <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
          </div>
          <button
            onClick={handleAddNewUser}
            className="ml-4 px-2 py-2 bg-blue-600 text-white rounded-md "
          >
            ADD NEW USER
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <DataTable
          items={items}
          columns={columns}
          idKey="id"
          itemsPerPage={15}
          tableType="user"
        />
      </div>
    </div>
  );
};

export default UsersPage;
