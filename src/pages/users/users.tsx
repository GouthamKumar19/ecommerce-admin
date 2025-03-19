import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import { Edit } from "@mui/icons-material";
import Switch from "@mui/material/Switch";
import ConfirmationDialog from "../../components/common/Dialog";
import { User } from "../../types/users.types"; // Ensure this path is correct
import SearchBar from "../../components/common/SearchBar"; // Import the SearchBar component
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import TableSkeletonLoader from "../../components/common/TableSkeletonLoader"; // Import Skeleton Loader
import { getAllUser } from "../../api/user"; // Import the API function for fetching users

const UsersPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [disabledRows, setDisabledRows] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogSubtitle, setDialogSubtitle] = useState("");
  const [currentRow, setCurrentRow] = useState<User | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | null;
  }>({ key: "", direction: null });

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Define payload for API call
  const payload = {
    options: {
      page: 1,
      itemsPerPage: 15,
      sortBy: ["name"], // Example sort, adjust as needed
      sortDesc: [false], // Example sort, adjust as needed
    },
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true); // Start loading
      setError(null); // Reset error

      setTimeout(async () => {
        try {
          const response = await getAllUser(payload);
          setUsers(response);
        } catch (err: any) {
          setError(err.message || "Failed to fetch users");
        } finally {
          setIsLoading(false);
        }
      }, 500); // Simulating network delay
    };

    fetchUserData();
  }, []); // Empty dependency array means this runs once on component mount

  const renderSortIcon = (key: string) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <ArrowUpwardIcon />
      ) : (
        <ArrowDownwardIcon />
      );
    }
    return <SwapVertIcon />;
  };

  const columns = [
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Name</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("name")}
          >
            {renderSortIcon("name")}
          </div>
        </div>
      ),
      key: "name",
      render: (item: User) => (
        <div className="text-sm text-gray-900">{item.name}</div>
      ),
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Email</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("email")}
          >
            {renderSortIcon("email")}
          </div>
        </div>
      ),
      key: "email",
      render: (item: User) => (
        <div className="text-sm text-gray-900">{item.email}</div>
      ),
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Phone</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("phone")}
          >
            {renderSortIcon("phone")}
          </div>
        </div>
      ),
      key: "phone",
      render: (item: User) => (
        <div className="text-sm text-gray-900">{item.phone}</div>
      ),
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Actions</span>
        </div>
      ),
      key: "actions",
      render: (item: User) => actionRenderer(item),
    },
  ];

  const handleAddNewUser = () => {
    navigate("/users/new");
  };

  const handleToggleRow = (item: User) => {
    setCurrentRow(item);
    if (disabledRows.includes(String(item._id))) {
      setDialogTitle("Enable User");
      setDialogSubtitle("Are you sure you want to enable this user?");
    } else {
      setDialogTitle("Disable User");
      setDialogSubtitle("Are you sure you want to disable this user?");
    }
    setDialogOpen(true);
  };

  const handleEditUser = (item: User) => {
    navigate(`/users/${item._id}`, { state: { user: item } });
  };

  const handleDialogClose = (confirm: boolean) => {
    if (confirm && currentRow) {
      setDisabledRows((prev) => {
        if (prev.includes(String(currentRow._id))) {
          return prev.filter((rowId) => rowId !== String(currentRow._id));
        } else {
          return [...prev, String(currentRow._id)];
        }
      });
    }
    setDialogOpen(false);
    setCurrentRow(null);
  };

  const handleSort = (key: string) => {
    let direction: "ascending" | "descending" | null = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    return sortConfig.key && sortConfig.direction
      ? [...users].sort((a, b) => {
          const aValue = a[sortConfig.key] as string | number;
          const bValue = b[sortConfig.key] as string | number;

          if (aValue < bValue) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        })
      : users;
  }, [users, sortConfig]);

  const actionRenderer = (item: User) => {
    const isDisabled = disabledRows.includes(String(item._id));
    return (
      <div className="flex justify-center items-center gap-4">
        <Edit
          sx={{ fontSize: 26, color: "#0d7f3f", cursor: "pointer" }}
          onClick={() => handleEditUser(item)}
        />
        <Switch
          checked={!isDisabled}
          onChange={() => handleToggleRow(item)}
          inputProps={{ "aria-label": "Toggle user status" }}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: "#0d7f3f",
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#0d7f3f",
            },
          }}
        />
      </div>
    );
  };

  return (
    <div>
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex justify-center w-full md:w-auto flex-grow">
            <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
          </div>
          <button
            onClick={handleAddNewUser}
            disabled={isLoading}
            className="ml-4 px-2 py-2 bg-blue-600 text-white rounded-md"
          >
            Add New User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        {isLoading ? (
          <TableSkeletonLoader columns={4} rows={10} /> // Show the skeleton loader while loading
        ) : (
          <DataTable
            items={sortedUsers}
            columns={columns}
            idKey="_id" // Updated to use _id
            itemsPerPage={15}
            actionRenderer={actionRenderer}
            disabledRows={disabledRows}
            loading={isLoading}
          />
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        title={dialogTitle}
        subtitle={dialogSubtitle}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default UsersPage;
