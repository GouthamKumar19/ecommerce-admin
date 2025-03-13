import React, { useState } from "react";
import DataTable from "../../components/common/DataTable";
import { orderMockData } from "../../config/mock/orderNew";
import type { Order } from "../../types/order.types";
import { useNavigate } from "react-router-dom";
import { Visibility, FilterList } from "@mui/icons-material";
import { Button } from "@mui/material";
import OrderFilterDialog from "../../components/orders/OrderFilterDialog";

const OrderPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [filters, setFilters] = useState<{
    paymentStatus: string;
    orderStatus: string;
  }>({
    paymentStatus: "",
    orderStatus: "",
  });
  const actionRenderer = () => (
        <div className="flex justify-center items-center gap-4">  
          <Visibility
                  sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
                  onClick={() => navigate(`/orders/:id`)}
                />
         
        </div>
      );
  
  const [openFilterDialog, setOpenFilterDialog] = useState<boolean>(false);
  const navigate = useNavigate();

  const columns = [
    {
      header: "Order ID",
      key: "orderId",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.orderId}</div>
      ),
    },
    {
      header: "Username",
      key: "username",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.username}</div>
      ),
    },
    {
      header: "Amount",
      key: "amount",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">${item.amount.toFixed(2)}</div>
      ),
    },
    {
      header: "Date",
      key: "date",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">
          {new Date(item.date).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: "Payment Status",
      key: "paymentStatus",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.paymentStatus}</div>
      ),
    },
    {
      header: "Order Status",
      key: "orderStatus",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.orderStatus}</div>
      ),
    },
    {
      header: "Actions",
      key: "actions",
    }
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
            <form role="search" className="flex items-center w-full max-w-sm">
              <div className="relative flex-1">
                <input
                  type="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
                  style={{ height: "42px" }}
                />
                <div
                  className="absolute rounded-l-none rounded-md inset-y-0 right-0 flex items-center justify-center px-3"
                  style={{
                    background: "var(--secondary-color)",
                    height: "42px",
                  }}
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
                    />
                  </svg>
                </div>
              </div>
            </form>
          </div>

          <div className="flex ml-auto">
            <Button
              variant="contained"
              startIcon={<FilterList />}
              onClick={handleFilterClick}
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
        onApply={applyFilters}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <DataTable<Order>
          items={orderMockData
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
          columns={columns}
          idKey="orderId"
          itemsPerPage={15}
          tableType="order"
          actionRenderer={actionRenderer}
        />
      </div>
    </div>
  );
};

export default OrderPage;
