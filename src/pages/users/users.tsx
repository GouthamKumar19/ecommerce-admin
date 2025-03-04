import DataTable from "../../components/DataTable"; // Import the DataTable component

const UsersPage = () => {
  return (
    <div>
      
        

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 px-2 ">
            <input
              type="text"
              placeholder="Search Users"
              className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button className="ml-4 px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Add New User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        {/* Call DataTable component here */}
        <DataTable />
      </div>
    </div>
  );
};

export default UsersPage;
