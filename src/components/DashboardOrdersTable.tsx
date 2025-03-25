import React, { useState, useEffect } from "react";
import DataTable from "../components/common/DataTable";
import type { Order } from "../types/order.types";
import { useNavigate } from "react-router-dom";
import { Visibility } from "@mui/icons-material";
import TableSkeletonLoader from "../components/common/TableSkeletonLoader";
import { getAllOrders } from "../api/orders";

const DashboardOrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
        const response = await getAllOrders();
        setOrders(response.data.tableData);
      } catch (err: any) {
        console.error("Failed to fetch orders:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  const columns = [
    {
      header: "Order ID",
      key: "orderId",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.orderId}</div>
      ),
    },
    {
      header: "Customer Name",
      key: "customerDetails.name",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.customerDetails.name}</div>
      ),
    },
    {
      header: "Total",
      key: "total",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">${item.total.toFixed(2)}</div>
      ),
    },
    {
      header: "Date",
      key: "createdAt",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">
          {new Date(item.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: "Payment Status",
      key: "paymentDetails.status",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">
          {item.paymentDetails.status}
        </div>
      ),
    },
    {
      header: "Order Status",
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
      render: (item: Order) => actionRenderer(item),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {isLoading ? (
        <TableSkeletonLoader columns={7} rows={5} />
      ) : (
        <DataTable<Order>
          items={orders}
          columns={columns}
          idKey="_id"
          itemsPerPage={5}
          tableType="order"
          actionRenderer={actionRenderer}
          loading={isLoading}
        />
      )}
    </div>
  );
};

export default DashboardOrdersTable;
