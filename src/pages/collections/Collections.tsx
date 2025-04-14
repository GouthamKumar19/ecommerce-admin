import React, { useState, useEffect, useRef } from "react";
import DataTable from "../../components/common/DataTable";
import { useNavigate } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info"; // Import InfoIcon
import ConfirmationDialog from "../../components/common/Dialog";
import SearchBar from "../../components/common/SearchBar";
import TableSkeletonLoader from "../../components/common/TableSkeletonLoader";
import SortableHeader, {
  SortConfig,
} from "../../components/common/SortableHeader";
import {
  useSortableData,
  getNextSortDirection,
} from "../../components/common/SortUtils";
import { getAllCollection, deleteCollection } from "../../api/collections";
import type { Collection } from "../../types/collections.types";
import { getImage } from "../../utils/imagePreview";

export interface CollectionResponse {
  tableData: Collection[];
  totalCount: number;
}

const CollectionsPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogSubtitle, setDialogSubtitle] = useState("");
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(
    null
  );
  const [collections, setCollections] = useState<Collection[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0); // Total number of items
  const [pageCount, setPageCount] = useState<number>(0); // Total number of pages
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "updatedAt",
    direction: "descending",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const abortControllerRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
      setPage(1);
    }, [searchValue]);

  useEffect(() => {
    const fetchCollections = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setIsLoading(true);

      try {
        const payload = {
          search: [
            {
              term: searchValue,
              fields: ["name"],
              startsWith: true,
              endsWith: false,
            },
          ],
          options: {
            sortBy: [sortConfig.key],
            sortDesc: [sortConfig.direction === "descending"],
            page: page,
            itemsPerPage: itemsPerPage,
          },
        };
        const response = await getAllCollection(payload);

        if (response && response.data) {
          const responseData = response.data as unknown as CollectionResponse;
          setCollections(responseData.tableData);
          setTotalCount(responseData.totalCount);
          setPageCount(Math.ceil(responseData.totalCount / itemsPerPage)); // Calculate page count
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err: any) {
        if (!signal.aborted) {
          setError(err.message || "Failed to fetch collections");
        }
      } finally {
        setTimeout(() => setIsLoading(false), 1000); // 1 second delay
      }
    };

    fetchCollections();
  }, [searchValue, sortConfig, page, itemsPerPage]);

  const handleAddNewCollection = () => {
    navigate("/collection/new");
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
          const response = await deleteCollection(currentCollection._id);

          if (response.status === 200) {
            setCollections((prevData) =>
              prevData.filter(
                (collection) => collection._id !== currentCollection._id
              )
            );
            setTotalCount((prev) => prev - 1); // Update total count after deletion
            setPageCount(Math.ceil((totalCount - 1) / itemsPerPage)); // Recalculate page count
          } else {
            throw new Error("Failed to delete collection");
          }
        } catch (err: any) {
          setError(err.message || "Failed to delete collection");
        } finally {
          setIsLoading(false);
        }
      }
    }
    setDialogOpen(false);
    setCurrentCollection(null);
  };

  const handleSort = (key: string) => {
    const direction = getNextSortDirection(
      sortConfig.key,
      key,
      sortConfig.direction
    );
    setSortConfig({ key, direction });
  };

  const sortedCollections = useSortableData(collections, sortConfig);

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

  const columns = [
    {
      header: "BannerImage",
      key: "bannerImage",
      render: (item: Collection) => (
        <div className="text-center flex-shrink-0 h-16 w-24">
          <img
            className="h-16 w-24 object-cover rounded cursor-pointer"
            src={getImage(item.bannerImage)}
            alt={item.name}
            onClick={() =>
              navigate(`/collections/collection-product/${item._id}`)
            }
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
          <div className="flex items-center justify-center mb-4">
            <InfoIcon sx={{ color: "#1976d2", marginRight: "8px",marginTop:"4px" }} />
            <p className="text-gray-700 text-sm font-medium mt-2">
              Press on the image to add products to the collection.
            </p>
          </div>
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
              disabled={isLoading}
            >
              ADD COLLECTION
            </button>
          </div>
        </div>
      </div>

      {/* Add instruction line with Info Icon */}

      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        {isLoading ? (
          <TableSkeletonLoader columns={4} rows={10} /> // Show the skeleton loader while loading
        ) : (
          <DataTable
            items={sortedCollections}
            columns={columns}
            idKey="_id"
            itemsPerPage={itemsPerPage}
            totalCount={totalCount} // Pass the total count
            pageCount={pageCount} // Pass the total page count
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
            actionRenderer={actionRenderer}
            loading={isLoading}
          />
        )}
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
