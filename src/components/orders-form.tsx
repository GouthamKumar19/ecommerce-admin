import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { Order, PaymentStatus, OrderStatus } from "../types/orders.types";
import {
  getOrderById,
  paymentStatuses,
  orderStatuses,
} from "../config/mock/ordersData";
import { useNavigate } from "react-router-dom";

const OrdersForm = () => {
  // State to hold the current order
  const [order, setOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  // States for dropdown controls
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  const [orderStatus, setOrderStatus] = useState<OrderStatus | "">("");
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);

  // Refs for dropdown containers
  const containerRef = useRef<HTMLDivElement>(null);
  const paymentDropdownRef = useRef<HTMLDivElement>(null);
  const orderDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        paymentDropdownRef.current &&
        !paymentDropdownRef.current.contains(event.target as Node)
      ) {
        setShowPaymentDropdown(false);
      }
      if (
        orderDropdownRef.current &&
        !orderDropdownRef.current.contains(event.target as Node)
      ) {
        setShowOrderDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch order data on component mount
  useEffect(() => {
    const mockOrder = getOrderById("ORD12345");
    if (mockOrder) {
      setOrder(mockOrder);
      setPaymentStatus(mockOrder.paymentStatus);
      setOrderStatus(mockOrder.orderStatus);
    }
  }, []);

  const handlePaymentStatusChange = (status: PaymentStatus) => {
    setPaymentStatus(status);
    setShowPaymentDropdown(false);
  };

  const handleOrderStatusChange = (status: OrderStatus) => {
    setOrderStatus(status);
    setShowOrderDropdown(false);
  };

  const handleUpdate = () => {
    if (order) {
      // Update the order with new statuses
      const updatedOrder = {
        ...order,
        paymentStatus,
        orderStatus,
      };
      console.log("Updated order:", updatedOrder);
      // Here you would typically send this to your API
    }
  };

  const handleBackClick = () => {
    navigate("/orders");
  };

  if (!order) {
    return <div className="p-4">Loading order data...</div>;
  }

  return (
    <div ref={containerRef} className="relative">
      {" "}
      {/* Add relative positioning */}
      {/* Back button */}
      <div className="mb-3">
        <ArrowLeft
          size={24}
          className="text-gray-700 cursor-pointer"
          onClick={handleBackClick}
        />
      </div>
      {/* Order ID as title */}
      <div className="mb-4 px-2">
        <h1 className="text-2xl font-bold flex items-center">
          <span className="mr-2">ORDER ID:</span>
          <span className="text-gray-700">{order.id}</span>
        </h1>
      </div>
      {/* Row 1: Name, Shipping Address, Billing Address */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2 py-1">
          {/* Name Section */}
          <div>
            <label className="block font-semibold mb-2 text-sm tracking-wide text-gray-800 text-left">
              NAME
            </label>
            <div className="w-full border border-gray-300 p-3 rounded-md bg-gray-50 flex items-center justify-center h-20">
              <div className="text-sm text-gray-700 leading-tight text-center">
                <p className="font-normal">{order.customerName}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address Section */}
          <div>
            <label className="block font-semibold mb-2 text-sm tracking-wide text-gray-800 text-left">
              SHIPPING ADDRESS
            </label>
            <div className="w-full border border-gray-300 p-3 rounded-md bg-gray-50 h-20">
              <div className="text-sm text-gray-700 leading-tight">
                <p className="font-normal">
                  {order.shippingAddress.name}, {order.shippingAddress.zipCode}
                </p>
                <p className="font-normal">
                  {order.shippingAddress.streetAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Billing Address Section */}
          <div>
            <label className="block font-semibold mb-2 text-sm tracking-wide text-gray-800 text-left">
              BILLING ADDRESS
            </label>
            <div className="w-full border border-gray-300 p-3 rounded-md bg-gray-50 h-20">
              <div className="text-sm text-gray-700 leading-tight">
                <p className="font-normal">
                  {order.billingAddress.name}, {order.billingAddress.zipCode}
                </p>
                <p className="font-normal">
                  {order.billingAddress.streetAddress}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Row 2: Products */}
      <div className="mb-6">
        <div className="px-2 py-1">
          <label className="block font-semibold mb-3 text-sm tracking-wide text-gray-800 text-left">
            PRODUCTS
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {order.products.map((product) => (
              <div
                key={product.id}
                className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-300"
              >
                <div className="mr-3">
                  <img
                    src={product.image}
                    alt={`${product.brand} ${product.name}`}
                    className="w-16 h-16 object-cover rounded-md shadow-sm"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-base">
                    {product.brand}
                  </p>
                  <p className="text-sm text-gray-700 font-normal">
                    {product.name}
                  </p>
                  <div className="mt-2 space-y-1 flex flex-col items-center">
                    <div className="flex justify-center w-full text-sm">
                      <span className="font-medium text-gray-700 mr-2">
                        DISCOUNT:
                      </span>
                      <span className="text-gray-900">{product.discount}%</span>
                    </div>
                    <div className="flex justify-center w-full text-sm">
                      <span className="font-medium text-gray-700 mr-2">
                        AMOUNT:
                      </span>
                      <span className="text-gray-900">
                        ${product.currentPrice}
                      </span>
                      <span className="ml-1 line-through text-gray-400">
                        ${product.originalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Row 3: Payment Status, Order Status */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2 py-1 items-end">
          {/* Payment Status Section */}
          <div className="relative" ref={paymentDropdownRef}>
            <label className="block font-semibold mb-2 text-sm tracking-wide text-gray-800 text-left">
              PAYMENT STATUS
            </label>
            <button
              className={`w-full border border-gray-300 p-3 rounded-md flex justify-between items-center text-gray-700 bg-[color:var(--primary-color)] hover:bg-gray-50 ${
                showPaymentDropdown
                  ? "focus:outline-none focus:ring-2 focus:ring-green-500"
                  : ""
              }`}
              style={{ background: "var(--primary-color)" }}
              onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
            >
              <span className="font-normal">
                {paymentStatus || "Payment Status"}
              </span>
              <span
                className={`transform transition-transform duration-200 text-green-500 ${
                  showPaymentDropdown ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {showPaymentDropdown && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                <div className="max-h-40 overflow-y-auto">
                  {paymentStatuses.map((status) => (
                    <div
                      key={status}
                      className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 font-normal"
                      onClick={() => handlePaymentStatusChange(status)}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Status Section */}
          <div className="relative flex items-center" ref={orderDropdownRef}>
            <div className="flex-grow mr-2">
              <label className="block font-semibold mb-2 text-sm tracking-wide text-gray-800 text-left">
                ORDER STATUS
              </label>
              <button
                className={`w-full border border-gray-300 p-3 rounded-md flex justify-between items-center text-gray-700 bg-[color:var(--primary-color)] hover:bg-gray-50 ${
                  showOrderDropdown
                    ? "focus:outline-none focus:ring-2 focus:ring-green-500"
                    : ""
                }`}
                style={{ background: "var(--primary-color)" }}
                onClick={() => setShowOrderDropdown(!showOrderDropdown)}
              >
                <span className="font-normal">
                  {orderStatus || "Order Status"}
                </span>
                <span
                  className={`transform transition-transform duration-200 text-green-500 ${
                    showOrderDropdown ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {showOrderDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  <div className="max-h-40 overflow-y-auto">
                    {orderStatuses.map((status) => (
                      <div
                        key={status}
                        className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 font-normal"
                        onClick={() => handleOrderStatusChange(status)}
                      >
                        {status}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Update Button fixed at the bottom-right */}
      <button
        className="bg-green-600 text-white px-8 py-3 rounded-md font-medium hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 shadow-sm text-base absolute bottom-6 right-6"
        onClick={handleUpdate}
      >
        UPDATE
      </button>
      {/* Extra padding/space at the bottom to ensure dropdowns fit within container */}
      <div className="h-10"></div>
    </div>
  );
};

export default OrdersForm;
