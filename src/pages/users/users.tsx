import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import { items } from "../../config/mock/userTable";
import { Edit } from "@mui/icons-material";
import Switch from "@mui/material/Switch";
import ConfirmationDialog from "../../components/common/Dialog";
import { User } from "../../types/users.types"; // Ensure this path is correct
import SearchBar from "../../components/common/SearchBar"; // Import the SearchBar component

const fetchUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(items), 1000);
  });
};

const UsersPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [disabledRows, setDisabledRows] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogSubtitle, setDialogSubtitle] = useState("");
  const [currentRow, setCurrentRow] = useState<User | null>(null);
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

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
    navigate("/users/:id");
  };

  const handleToggleRow = (item: User) => {
    setCurrentRow(item);
    if (disabledRows.includes(String(item.id))) {
      setDialogTitle("Enable User");
      setDialogSubtitle("Are you sure you want to enable this user?");
    } else {
      setDialogTitle("Disable User");
      setDialogSubtitle("Are you sure you want to disable this user?");
    }
    setDialogOpen(true);
  };

  const handleEditUser = (item: User) => {
    navigate("/users/:id", { state: { user: item } });
  };

  const handleDialogClose = (confirm: boolean) => {
    if (confirm && currentRow) {
      setDisabledRows((prev) => {
        if (prev.includes(String(currentRow.id))) {
          return prev.filter((rowId) => rowId !== String(currentRow.id));
        } else {
          return [...prev, String(currentRow.id)];
        }
      });
    }
    setDialogOpen(false);
    setCurrentRow(null);
  };

  const actionRenderer = (item: User) => {
    const isDisabled = disabledRows.includes(String(item.id));
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
          items={users}
          columns={columns}
          idKey="id"
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
