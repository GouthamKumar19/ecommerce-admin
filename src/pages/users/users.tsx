import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import { items } from "../../config/mock/userTable"; // Assuming this provides mock data
import { Edit } from "@mui/icons-material";
import Switch from "@mui/material/Switch";
import ConfirmationDialog from "../../components/common/Dialog";
import { User } from "../../types/users.types"; // Ensure this path is correct
import SearchBar from "../../components/common/SearchBar"; // Import the SearchBar component
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const fetchUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(items), 1000); // Simulating fetch delay
  });
};

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

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Optional: If you need to perform any actions when the component mounts
  }, []);

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
    // Navigate to the user details page for creating a new user
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
    navigate(`/users/${item._id}`, { state: { user: item } }); // Updated to use _id
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
    if (sortConfig.key && sortConfig.direction) {
      return [...users].sort((a, b) => {
        const aValue = a[sortConfig.key] as string | number;
        const bValue = b[sortConfig.key] as string | number;

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return users;
  }, [users, sortConfig]);

  const actionRenderer = (item: User) => {
    const isDisabled = disabledRows.includes(String(item._id)); // Updated to _id
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
            {/* Use the SearchBar component */}
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
        <DataTable
          items={sortedUsers}
          columns={columns}
          idKey="_id" // Updated to use _id
          itemsPerPage={15}
          actionRenderer={actionRenderer}
          disabledRows={disabledRows}
          loading={isLoading}
        />
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
