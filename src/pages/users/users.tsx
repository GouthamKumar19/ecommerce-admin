import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import { items } from "../../config/mock/userTable";
import { Edit } from "@mui/icons-material";
import Switch from "@mui/material/Switch";
import ConfirmationDialog from "../../components/common/Dialog";
import { User } from "../../types/users.types"; // Ensure this path is correct

const UsersPage: React.FC = () => {
  const [disabledRows, setDisabledRows] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogSubtitle, setDialogSubtitle] = useState("");
  const [currentRow, setCurrentRow] = useState<User | null>(null);

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
          actionRenderer={actionRenderer}
          disabledRows={disabledRows}
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
