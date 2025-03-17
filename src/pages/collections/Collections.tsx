import React, { useState } from "react";
import DataTable from "../../components/common/DataTable";
import { collectionMockData } from "../../config/mock/collections";
import type { Collection } from "../../types/collections.types";
import { useNavigate } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import ConfirmationDialog from "../../components/common/Dialog";

const CollectionsPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [collections, setCollections] =
    useState<Collection[]>(collectionMockData);
  const navigate = useNavigate();

  const handleAddNewCollection = () => {
    // Navigate to the collection creation page
    navigate("/collection/:id");
  };

  const handleDeleteCollection = (collectionId: string | number) => {
    setSelectedCollection(
      collections.find((collection) => collection.id === collectionId) || null
    );
    setDialogOpen(true);
  };
  

  const confirmDeleteCollection = () => {
    if (selectedCollection) {
      console.log(`Deleting collection with ID: ${selectedCollection.id}`);
      setCollections(
        collections.filter(
          (collection) => collection.id !== selectedCollection.id
        )
      );
    }
    setDialogOpen(false);
    setSelectedCollection(null);
  };
  const handleEditUser = (item: Collection) => {
      navigate("/collection/:id", { state: { collection: item } });
    };

  const actionRenderer = (item: Collection) => (
    <div className="flex justify-center items-center gap-2">
      <Edit
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleEditUser(item)}
      />
      <Delete
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleDeleteCollection(item.id)}
      />
    </div>
  );

  // Define columns for collections table
  const columns = [
    {
      header: "BannerImage",
      key: "bannerImage",
      render: (item: Collection) => (
        <div className="text-center flex-shrink-0 h-16 w-24">
          <img
            className="h-16 w-24 object-cover rounded"
            src={item.imageUrl}
            alt={item.name}
          />
        </div>
      ),
    },
    {
      header: "Banner Name",
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
      header: "Actions",
      key: "actions",
    },
  ];

  // Filter collections based on search value
  const filteredCollections = searchValue
    ? collections.filter(
        (collection) =>
          collection.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          (collection.description &&
            collection.description
              .toLowerCase()
              .includes(searchValue.toLowerCase()))
      )
    : collections;

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex justify-center w-full md:w-auto flex-grow">
            {/* Search bar */}
            <form role="search" className="flex items-center w-full max-w-sm">
              <div className="relative flex-1">
                <input
                  type="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search collections"
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

          <div className="flex ml-auto">
            <button
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={handleAddNewCollection}
            >
              Add Collection
            </button>
          </div>
        </div>
      </div>

      {/* Collections Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <DataTable
          items={filteredCollections}
          columns={columns}
          idKey="id"
          itemsPerPage={10}
          tableType="collection"
          actionRenderer={actionRenderer}
        />
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        title="Delete Collection"
        subtitle={`Are you sure you want to delete the collection "${selectedCollection?.name}"?`}
        onClose={(confirm: boolean) => {
          if (confirm) {
            confirmDeleteCollection();
          } else {
            setDialogOpen(false);
            setSelectedCollection(null);
          }
        }}
      />
    </div>
  );
};

export default CollectionsPage;
