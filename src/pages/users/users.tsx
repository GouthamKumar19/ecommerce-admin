import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import { items } from "../../config/mock/userTable";

const UsersPage = () => {
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
  const navigate = useNavigate();

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
            {/* StoreFront UI inspired search bar */}
            <form role="search" className="flex items-center w-full max-w-sm">
              <div className="relative flex-1">
                <input
                  type="search"
                  placeholder="Search"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
                  style={{ height: "42px" }}
                />
                <div
                  style={{
                    background: "var(--secondary-color)",

                    height: "42px",
                  }}
                  className="absolute rounded-l-none rounded-md inset-y-0 right-0 flex items-center justify-center px-3"
                >
                  <svg
                    className="w-6 h-6 text-white text-bold"
                    // style={{ color: "var(--secondary-color)" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35m2.35-5.65A7 7 0 1 1 4 12a7 7 0 0 1 14 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            </form>
          </div>
          <button
            onClick={handleAddNewUser}
            className="ml-4 px-2 py-2 bg-blue-600 text-white rounded-md "
          >
            Add New User
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
