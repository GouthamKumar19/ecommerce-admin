import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import { Edit } from "@mui/icons-material";
import Switch from "@mui/material/Switch";
import ConfirmationDialog from "../../components/common/Dialog";
import { User } from "../../types/users.types";
import SearchBar from "../../components/common/SearchBar";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import TableSkeletonLoader from "../../components/common/TableSkeletonLoader";
import { getAllUser, updateUser } from "../../api/user";
import { SortConfig } from "../../components/common/SortableHeader";
import {
  useSortableData,
  getNextSortDirection,
} from "../../components/common/SortUtils";
// Remove the toast import
// import { toast } from "react-toastify"; 

const UsersPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "updatedAt",
    direction: "descending",
  });
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [, setError] = useState<string | null>(null); // Error state
  const [page, setPage] = useState<number>(1); // Pagination state
  const [itemsPerPage] = useState<number>(10); // Items per page
  const [pageCount, setPageCount] = useState<number>(0); // Page count state
  const [, setDisabledRows] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogSubtitle, setDialogSubtitle] = useState("");
  const [currentRow, setCurrentRow] = useState<User | null>(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);
    setTimeout(async () => {
      try {
        const effectiveSortConfig: SortConfig =
          sortConfig.direction === null
            ? { key: "updatedAt", direction: "descending" } // Default sort
            : sortConfig;

        const response = await getAllUser(
          page,
          itemsPerPage,
          searchValue,
          effectiveSortConfig // This is always a valid SortConfig object
        );
        setUsers(response.data.tableData);
        setPageCount(response.data.totalCount);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to fetch users");
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, [page, itemsPerPage, searchValue, sortConfig]);

  const handleSort = (key: string) => {
    const direction = getNextSortDirection(
      sortConfig.key,
      key,
      sortConfig.direction
    );
    setSortConfig({ key, direction });
  };

  const sortedUsers = useSortableData(users, sortConfig);

  const renderSortIcon = (key: string) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        return <ArrowUpwardIcon />;
      } else if (sortConfig.direction === "descending") {
        return <ArrowDownwardIcon />;
      } else if (sortConfig.direction === null) {
        return <SwapVertIcon />;
      }
    }
    return <SwapVertIcon />;
  };

  const handleToggleUserStatus = async (user: User) => {
    if (!user._id) {
      console.error("User ID is missing");
      return;
    }

    try {
      const updatedStatus = !user.isEnabled;

      await updateUser(user._id as string, {
        isEnabled: updatedStatus,
      });

      setDisabledRows((prev) => {
        if (prev.includes(String(user._id))) {
          return prev.filter((rowId) => rowId !== String(user._id));
        } else {
          return [...prev, String(user._id)];
        }
      });

      fetchUserData(); // Refresh the user list

      // Remove the toast notification logic
      // toast.success(
      //   `User ${updatedStatus ? "enabled" : "disabled"} successfully`
      // );
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    } finally {
      setDialogOpen(false);
      setCurrentRow(null);
    }
  };

  const handleSearch = () => {
    if (!searchValue) return sortedUsers;

    return sortedUsers.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchValue.toLowerCase())
    );
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
        <div className="text-sm text-gray-900">{item.name || "N/A"}</div>
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
        <div className="text-sm text-gray-900">{item.email || "N/A"}</div>
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
        <div className="text-sm text-gray-900">
          {item.phone || "N/A"}
        </div>
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
    if (!item.isEnabled) {
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
      handleToggleUserStatus(currentRow);
    } else {
      setDialogOpen(false);
      setCurrentRow(null);
    }
  };

  const filteredUsers = React.useMemo(() => {
    return handleSearch();
  }, [sortedUsers, searchValue]);

  const actionRenderer = (item: User) => {
    return (
      <div className="flex justify-center items-center gap-4">
        <Edit
          sx={{ fontSize: 26, color: "#0d7f3f", cursor: "pointer" }}
          onClick={() => handleEditUser(item)}
        />
        <Switch
          checked={item.isEnabled}
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
            className="ml-4 px-2 py-2 bg-[#0d7f3f] text-white rounded-md hover:bg-[#0d7f3f]/90"
          >
            Add New User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <TableSkeletonLoader columns={columns.length} rows={10} />
        ) : (
          <DataTable
            items={filteredUsers}
            columns={columns}
            idKey="_id"
            itemsPerPage={itemsPerPage}
            actionRenderer={actionRenderer}
            loading={isLoading}
            currentPage={page}
            onPageChange={(newPage) => {
              console.log("Changing page to:", newPage);
              setPage(newPage);
            }}
            pageCount={pageCount}
            totalCount={pageCount} // Add this line to pass the total count
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