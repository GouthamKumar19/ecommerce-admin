import React, { useState, useEffect } from "react";
import DataTable from "../components/common/DataTable";
import type { Order } from "../types/order.types";
import { useNavigate } from "react-router-dom";
import { Visibility } from "@mui/icons-material";
import TableSkeletonLoader from "../components/common/TableSkeletonLoader";
import { getAllOrders } from "../api/orders";
import SortableHeader, {
  SortConfig,
} from "../components/common/SortableHeader";
import {
  useSortableData,
  getNextSortDirection,
} from "../components/common/SortUtils";
import SearchBar from "../components/common/SearchBar";

const DashboardOrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "createdAt",
    direction: "descending",
  });
  const [page, setPage] = useState<number>(1); // Pagination state
  const [itemsPerPage] = useState<number>(5); // Items per page
  const navigate = useNavigate();

  const handleViewOrder = (item: Order) => {
    navigate(`/orders/${item._id}`, { state: { order: item } });
  };

  const actionRenderer = (item: Order) => (
    <div className="flex justify-center items-center gap-4">
      <Visibility
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleViewOrder(item)}
      />
    </div>
  );

  useEffect(() => {
    const fetchOrderData = async () => {
      setIsLoading(true);

      try {
        const response = await getAllOrders(
          page,
          itemsPerPage,
          searchValue,
          sortConfig
        );
        setOrders(response.data.tableData);
      } catch (err: any) {
        console.error("Failed to fetch orders:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [page, itemsPerPage, searchValue, sortConfig]);

  const handleSort = (key: string) => {
    const direction = getNextSortDirection(
      sortConfig.key,
      key,
      sortConfig.direction
    );
    setSortConfig({ key, direction });
  };

  const sortedOrders = useSortableData(orders, sortConfig);

  const columns = [
    {
      header: (
        <SortableHeader
          label="Order ID"
          columnKey="orderId"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "orderId",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.orderId}</div>
      ),
    },
    {
      header: (
        <SortableHeader
          label="Customer Name"
          columnKey="customerDetails.name"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "customerDetails.name",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.customerDetails.name}</div>
      ),
    },
    {
      header: (
        <SortableHeader
          label="Total"
          columnKey="total"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "total",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">${item.total.toFixed(2)}</div>
      ),
    },
    {
      header: (
        <SortableHeader
          label="Date"
          columnKey="createdAt"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "createdAt",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">
          {new Date(item.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: (
        <SortableHeader
          label="Payment Status"
          columnKey="paymentDetails.status"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "paymentDetails.status",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">
          {item.paymentDetails.status}
        </div>
      ),
    },
    {
      header: (
        <SortableHeader
          label="Order Status"
          columnKey="status"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "status",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.status}</div>
      ),
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Actions</span>
        </div>
      ),
      key: "actions",
      render: actionRenderer,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <SearchBar searchValue={searchValue} onSearchChange={setSearchValue} />
      </div>
      {isLoading ? (
        <TableSkeletonLoader columns={7} rows={5} />
      ) : (
        <DataTable<Order>
          items={sortedOrders}
          columns={columns}
          idKey="_id"
          itemsPerPage={itemsPerPage}
          tableType="order"
          actionRenderer={actionRenderer}
          loading={isLoading}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default DashboardOrdersTable;
