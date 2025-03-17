import React, { useState } from "react";
import DataTable from "../../components/common/DataTable";
import { useQuery } from "@tanstack/react-query";
import { orderMockData } from "../../config/mock/orderNew";
import type { Order } from "../../types/order.types";
import { useNavigate } from "react-router-dom";
import { Visibility, FilterList } from "@mui/icons-material";
import { Button } from "@mui/material";
import OrderFilterDialog from "../../components/orders/OrderFilterDialog";
import SearchBar from "../../components/common/SearchBar"; // Import the SearchBar component
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const fetchOrders = async (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(orderMockData), 1000);
  });
};

const OrderPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [filters, setFilters] = useState<{
    paymentStatus: string;
    orderStatus: string;
  }>({
    paymentStatus: "",
    orderStatus: "",
  });

  const [openFilterDialog, setOpenFilterDialog] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | null;
  }>({ key: "", direction: null });
  const navigate = useNavigate();

  const actionRenderer = (item: Order) => (
    <div className="flex justify-center items-center gap-4">
      <Visibility
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() =>
          navigate(`/orders/${item.orderId}?action=edit`, {
            state: { order: item },
          })
        }
      />
    </div>
  );

  const { data: orderMockData = [], isLoading } = useQuery({
    queryKey: ["orderMockData"],
    queryFn: fetchOrders,
  });

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

  const sortedOrders = React.useMemo(() => {
    if (sortConfig.key && sortConfig.direction) {
      return [...orderMockData].sort((a, b) => {
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
    return orderMockData;
  }, [orderMockData, sortConfig]);

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

  const columns = [
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Order ID</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("orderId")}
          >
            {renderSortIcon("orderId")}
          </div>
        </div>
      ),
      key: "orderId",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.orderId}</div>
      ),
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Username</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("username")}
          >
            {renderSortIcon("username")}
          </div>
        </div>
      ),
      key: "username",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.username}</div>
      ),
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Amount</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("amount")}
          >
            {renderSortIcon("amount")}
          </div>
        </div>
      ),
      key: "amount",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">${item.amount.toFixed(2)}</div>
      ),
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Date</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("date")}
          >
            {renderSortIcon("date")}
          </div>
        </div>
      ),
      key: "date",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">
          {new Date(item.date).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Payment Status</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("paymentStatus")}
          >
            {renderSortIcon("paymentStatus")}
          </div>
        </div>
      ),
      key: "paymentStatus",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.paymentStatus}</div>
      ),
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Order Status</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("orderStatus")}
          >
            {renderSortIcon("orderStatus")}
          </div>
        </div>
      ),
      key: "orderStatus",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.orderStatus}</div>
      ),
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Actions</span>
        </div>
      ),
      key: "actions",
    },
  ];

  const handleFilterClick = () => {
    setOpenFilterDialog(true);
  };

  const applyFilters = (newFilters: {
    paymentStatus: string;
    orderStatus: string;
  }) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-1">
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex justify-center w-full md:w-auto flex-grow">
            {/* Use the SearchBar component */}
            <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
          </div>

          <div className="flex ml-auto">
            <Button
              variant="contained"
              startIcon={<FilterList />}
              onClick={handleFilterClick}
              disabled={isLoading}
              sx={{
                backgroundColor: "var(--secondary-color)",
                color: "#ffffff",
              }}
            >
              Filter
            </Button>
          </div>
        </div>
      </div>

      <OrderFilterDialog
        open={openFilterDialog}
        onClose={() => setOpenFilterDialog(false)}
        // @ts-expect-error non fix error
        onApply={applyFilters}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <DataTable<Order>
          items={sortedOrders
            .filter(
              (order) =>
                !filters.paymentStatus ||
                order.paymentStatus === filters.paymentStatus
            )
            .filter(
              (order) =>
                !filters.orderStatus ||
                order.orderStatus === filters.orderStatus
            )
            .filter((order) =>
              order.orderId.toLowerCase().includes(searchValue.toLowerCase())
            )}
          // @ts-expect-error non fix error
          columns={columns}
          idKey="orderId"
          itemsPerPage={15}
          tableType="order"
          actionRenderer={actionRenderer}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default OrderPage;
