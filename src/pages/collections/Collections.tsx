import React, { useState, useEffect } from "react";
import DataTable from "../../components/common/DataTable";
import { collectionMockData } from "../../config/mock/collections";
import type { Collection } from "../../types/collections.types";
import { useNavigate } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import ConfirmationDialog from "../../components/common/Dialog";
import SearchBar from "../../components/common/SearchBar";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useQuery } from "@tanstack/react-query";


const fetchCollections = async (): Promise<Collection[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(collectionMockData), 1000);
  });
};

const CollectionsPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogSubtitle, setDialogSubtitle] = useState("");
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(
    null
  );
  const [collections, setCollections] =
    useState<Collection[]>(collectionMockData);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | null;
  }>({ key: "", direction: null });

  const navigate = useNavigate();

  const { data: fetchedCollections = [], isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
  });

  // Initialize table data when collections are fetched
  useEffect(() => {
    if (fetchedCollections.length > 0) {
      setCollections(fetchedCollections);
    }
  }, [fetchedCollections]);

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
    navigate("/collection/:id", {
      state: { Collection: item },
    });
  };

  const handleDialogClose = (confirm: boolean) => {
    if (confirm && currentCollection) {
      if (dialogTitle === "Delete Collection") {
        // Delete the collection from the local state
        setCollections((prevData) =>
          prevData.filter(
            (collection) => collection.id !== currentCollection.id
          )
        );
        console.log(`Deleting collection with ID: ${currentCollection.id}`);
      } else {
        // Toggle the collection's enabled/disabled status
        setCollections((prev) => {
          if (prev.includes(currentCollection)) {
            return prev.filter(
              (collection) => collection.id !== currentCollection.id
            );
          } else {
            return [...prev, currentCollection];
          }
        });
      }
    }
    setDialogOpen(false);
    setCurrentCollection(null);
  };

  // Filter collections based on search input
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

  // Handle sorting
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

  const sortedCollections = React.useMemo(() => {
    if (sortConfig.key && sortConfig.direction) {
      return [...filteredCollections].sort((a, b) => {
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
    return filteredCollections;
  }, [filteredCollections, sortConfig]);

  const renderSortIcon = (key: string) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        return <ArrowUpwardIcon />;
      } else if (sortConfig.direction === "descending") {
        return <ArrowDownwardIcon />;
      }
    }
    return (
      <div className="flex flex-col gap-0">
        <SwapVertIcon />
      </div>
    );
  };

  // Define columns for collections table
  const columns = [
    {
      header: "BannerImage",
      key: "bannerImage",
      render: (item: Collection) => (
        <div className="text-center flex-shrink-0 h-16 w-24">
          <img
            className="h-16 w-24 object-cover rounded cursor-pointer"
            src={item.imageUrl}
            alt={item.name}
            onClick={() => navigate(`/collections/collection-product`)}
          />
        </div>
      ),
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Banner Name</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("name")}
          >
            {renderSortIcon("name")}
          </div>
        </div>
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
      header: "Actions",
      key: "actions",
      render: actionRenderer,
    },
  ];

 
  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex justify-center w-full md:w-auto flex-grow">
            {/* StoreFront UI inspired search bar */}
            <div className="flex justify-center w-full md:w-auto flex-grow">
              {/* Use the SearchBar component */}
              <SearchBar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
              />
            </div>
          </div>

          <div className="flex ml-auto">
            <button
              className="ml-4 px-2 py-2 bg-blue-600 text-white rounded-md"
              onClick={handleAddNewCollection}
              disabled={isLoading}
            >
              ADD COLLECTION
            </button>
          </div>
        </div>
      </div>

      {/* Collections Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <DataTable
          items={sortedCollections}
          // @ts-expect-error non fix error
          columns={columns}
          idKey="id"
          itemsPerPage={15}
          tableType="collection"
          actionRenderer={actionRenderer}
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

export default CollectionsPage;
