import React, { useState, useEffect } from "react";
import DataTable from "../../components/common/DataTable";
import { useNavigate } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import ConfirmationDialog from "../../components/common/Dialog";
import SearchBar from "../../components/common/SearchBar";

import SortableHeader, {
  SortConfig,
} from "../../components/common/SortableHeader";
import {
  useSortableData,
  getNextSortDirection,
} from "../../components/common/SortUtils";
import { getAllCollection, deleteCollection } from "../../api/collections"; // Updated import to include deleteCollection
import type { Collection } from "../../types/collections.types";

const CollectionsPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogSubtitle, setDialogSubtitle] = useState("");
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(
    null
  );
  const [collections, setCollections] = useState<Collection[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: null,
  });
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [error, setError] = useState<string | null>(null); // New state for error
  const navigate = useNavigate();

  const payload = {}; // Define your payload here if needed

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true); // Start loading
      setError(null); // Reset error
      setTimeout(async () => {
        try {
          const response = await getAllCollection(payload); // Call the API
          setCollections(response.data); // Set the fetched collections
          console.log("Fetched Collections:", response.data);
        } catch (err: any) {
          setError(err.message || "Failed to fetch collections"); // Handle any errors
        } finally {
          setIsLoading(false); // End loading
        }
      }, 500);
    };

    fetchCollections(); // Execute fetching function
  }, []); // Empty dependency array to run once on mount

  const handleAddNewCollection = () => {
    navigate("/collection/:id");
  };

  const handleDeleteCollection = (item: Collection) => {
    setCurrentCollection(item);
    setDialogTitle("Delete Collection");
    setDialogSubtitle(
      `Are you sure you want to delete the collection "${item.name}"?`
    );
    setDialogOpen(true);
  };

  const handleEditCollection = (item: Collection) => {
    navigate(`/collection/${item._id}`, { state: { Collection: item } });
  };

  const handleDialogClose = async (confirm: boolean) => {
    if (confirm && currentCollection) {
      if (dialogTitle === "Delete Collection") {
        setIsLoading(true);
        try {
          // Call the deleteCollection API function
          const response = await deleteCollection(currentCollection._id);

          if (response.status === 200) {
            // If successful, remove the collection from the state
            setCollections((prevData) =>
              prevData.filter(
                (collection) => collection._id !== currentCollection._id
              )
            );
            console.log(
              `Collection deleted successfully: ${currentCollection._id}`
            );
          } else {
            throw new Error("Failed to delete collection");
          }
        } catch (err: any) {
          setError(err.message || "Failed to delete collection");
          console.error("Error deleting collection:", err);
        } finally {
          setIsLoading(false);
        }
      }
    }
    setDialogOpen(false);
    setCurrentCollection(null);
  };

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const actionRenderer = (item: Collection) => (
    <div className="flex justify-center items-center gap-2">
      <Edit
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleEditCollection(item)}
      />
      <Delete
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleDeleteCollection(item)}
      />
    </div>
  );

  const handleSort = (key: string) => {
    const direction = getNextSortDirection(
      sortConfig.key,
      key,
      sortConfig.direction
    );
    setSortConfig({ key, direction });
  };

  const sortedCollections = useSortableData(filteredCollections, sortConfig);

  const columns = [
    {
      header: "BannerImage",
      key: "bannerImage",
      render: (item: Collection) => (
        <div className="text-center flex-shrink-0 h-16 w-24">
          <img
            className="h-16 w-24 object-cover rounded cursor-pointer"
            src={item.bannerImage} // Changed imageUrl to bannerImage
            alt={item.name}
            onClick={() => navigate(`/collections/collection-product`)}
          />
        </div>
      ),
    },
    {
      header: (
        <SortableHeader
          label="Banner Name"
          columnKey="name"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "name",
      render: (item: Collection) => (
        <div className="flex text-left">
          <div className="ml-0">
            <div className="text-sm font-medium text-gray-900">{item.name}</div>
          </div>
        </div>
      ),
    },
    {
      header: <span>Actions</span>,
      key: "actions",
      render: actionRenderer,
    },
  ];

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex justify-center w-full md:w-auto flex-grow">
            <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
          </div>

          <div className="flex ml-auto">
            <button
              className="ml-4 px-2 py-2 bg-blue-600 text-white rounded-md"
              onClick={handleAddNewCollection}
              disabled={isLoading} // Disable button while loading
            >
              ADD COLLECTION
            </button>
          </div>
        </div>
      </div>
      {isLoading && <div>Loading...</div>} {/* Loading Indicator */}
      {error && <div>Error: {error}</div>} {/* Error Display */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <DataTable
          items={sortedCollections}
          columns={columns}
          idKey="_id"
          itemsPerPage={15}
          tableType="collection"
          actionRenderer={actionRenderer}
          loading={isLoading}
        />
      </div>
      <ConfirmationDialog
        open={dialogOpen}
        title={dialogTitle}
        subtitle={dialogSubtitle}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default CollectionsPage;
