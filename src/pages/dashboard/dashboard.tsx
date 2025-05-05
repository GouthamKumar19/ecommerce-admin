"use client";
import DashboardOrdersTable from "../../components/DashboardOrdersTable";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CalendarToday, KeyboardArrowDown } from "@mui/icons-material";
import { LinearProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { Menu, MenuItem } from "@mui/material";
import { addDays, format, startOfDay, endOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getStats } from "@/api/dashboard";
import { DataResponse } from "@/types/dashboard.types";
import { ShoppingBagOutlined, MailOutline, AttachMoney, GroupOutlined } from "@mui/icons-material";

// Date preset options
const DATE_PRESETS = {
  TODAY: "TODAY",
  YESTERDAY: "YESTERDAY",
  LAST_7_DAYS: "LAST_7_DAYS",
  LAST_30_DAYS: "LAST_30_DAYS",
  LAST_6_MONTHS: "LAST_6_MONTHS",
  LAST_YEAR: "LAST_YEAR",
  LIFETIME: "LIFETIME",
};

const DashboardPage = () => {
  // API data state
  const [statsData, setStatsData] = useState<DataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter state
  const [selectedFilter, setSelectedFilter] = useState<string>(
    DATE_PRESETS.TODAY
  );

  // Date range state (for calendar)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  // Fetch stats data
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Send the selected filter value
        const apiResponse = await getStats({
          filter: selectedFilter,
        });

        // Extract the data property from the response and set state
        setStatsData(apiResponse);
      } catch (error) {
        console.error("Error fetching stats data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedFilter]);

  // Menu state and handlers
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Define filter values with proper type
  const filterValues = {
    today: DATE_PRESETS.TODAY,
    yesterday: DATE_PRESETS.YESTERDAY,
    last7days: DATE_PRESETS.LAST_7_DAYS,
    last30days: DATE_PRESETS.LAST_30_DAYS,
    last6months: DATE_PRESETS.LAST_6_MONTHS,
    lastyear: DATE_PRESETS.LAST_YEAR,
    lifetime: DATE_PRESETS.LIFETIME,
  };

  // Use a type-safe parameter to ensure option is a valid key
  const handleSelect = (option: keyof typeof filterValues) => {
    setSelectedFilter(filterValues[option]);
    handleClose();
  };

  // Handle manual date range selection
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);

    // When using manual date selection, we'll send the specific dates to the API
    // Only proceed if both from and to dates are defined
    if (range && range.from && range.to) {
      const fetchCustomDateRangeStats = async () => {
        setLoading(true);
        try {
          // Convert dates to milliseconds and set appropriate time
          // Using non-null assertion since we've already checked that the dates exist
          const startDateWithTime = startOfDay(range.from!).getTime(); // 00:00:00
          const endDateWithTime = endOfDay(range.to!).getTime(); // 23:59:59

          const response = await getStats({
            startDate: startDateWithTime.toString(),
            endDate: endDateWithTime.toString(),
          });
          setStatsData(response);
        } catch (error) {
          console.error("Error fetching custom date range stats:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCustomDateRangeStats();
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        {/* Top Controls Skeleton */}
        <div className="flex justify-between mb-6">
          <div></div>
          <div className="flex gap-4">
            <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-10 w-40 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>

        {/* Main Dashboard Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart Skeleton */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <div className="h-7 w-40 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-[300px] w-full bg-gray-100 rounded animate-pulse"></div>
          </div>

          {/* Order Status Cards Skeleton */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-7 w-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-10 w-full bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="h-5 w-36 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-7 w-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-10 w-full bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="h-6 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Recent Orders Table Skeleton */}
        <div className="mt-8">
          <div className="h-7 w-40 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4">
              <div className="h-10 w-full bg-gray-100 rounded mb-4 animate-pulse"></div>
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-16 w-full bg-gray-100 rounded-md mb-3 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Top Controls */}
      <div className="flex justify-between mb-6">
        <div></div>
        <div className="flex gap-4">
          <button
            className="border rounded-md px-4 py-2 flex items-center gap-2 bg-[#0d7f3f] text-white hover:bg-[#0d7f3f]/90"
            onClick={handleClick}
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            {selectedFilter} <KeyboardArrowDown />
          </button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => handleSelect("today")}>Today</MenuItem>
            <MenuItem onClick={() => handleSelect("yesterday")}>
              Yesterday
            </MenuItem>
            <MenuItem onClick={() => handleSelect("last7days")}>
              Last 7 Days
            </MenuItem>
            <MenuItem onClick={() => handleSelect("last30days")}>
              Last 30 Days
            </MenuItem>
            <MenuItem onClick={() => handleSelect("last6months")}>
              Last 6 Months
            </MenuItem>
            <MenuItem onClick={() => handleSelect("lastyear")}>
              Last Year
            </MenuItem>
            <MenuItem onClick={() => handleSelect("lifetime")}>
              Lifetime
            </MenuItem>
          </Menu>
          <Popover>
            <PopoverTrigger asChild>
              <button className="border rounded-md px-4 py-2 flex items-center gap-2 bg-[#0d7f3f] text-white hover:bg-[#0d7f3f]/90">
                {dateRange?.from ? (
                  <>
                    {format(dateRange.from, "MMM dd, y")} -{" "}
                    {dateRange.to ? format(dateRange.to, "MMM dd, y") : ""}
                  </>
                ) : (
                  "DATE RANGE"
                )}{" "}
                <CalendarToday fontSize="small" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
                className="flex"
                classNames={{
                  day_selected:
                    "bg-[#0d7f3f] text-white hover:bg-[#0d7f3f] hover:text-white",
                  day_today: "bg-[#0d7f3f] text-white",
                  day_range_middle: "bg-[#0d7f3f]/20 text-gray-700",
                  day_range_start: "bg-[#0d7f3f] text-white",
                  day_range_end: "bg-[#0d7f3f] text-white",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Product Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            PRODUCT SALES
          </h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={statsData?.graphData || []}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d7f3f" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0d7f3f" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="xaxis"
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    padding: "10px 14px",
                  }}
                  labelStyle={{ color: "#666", marginBottom: "5px" }}
                  itemStyle={{ color: "#10B981" }}
                  formatter={(value) => [`${value}`, ""]} // This removes the "yaxis" label
                />
                <Area
                  type="monotone"
                  dataKey="yaxis" // Keeps the data associated with "yaxis"
                  stroke="#0d7f3f"
                  strokeWidth={2}
                  fill="url(#colorSales)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Cards */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-600">NEW ORDER</h3>
              <span className="text-xl font-bold">
                {statsData?.newOrders || 0}
              </span>
            </div>
            <LinearProgress
              variant="determinate"
              value={
                ((statsData?.newOrders || 0) / (statsData?.totalOrders || 1)) *
                100
              }
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "#E5E7EB",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#0d7f3f",
                },
              }}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                CONFIRMED ORDER
              </h3>
              <span className="text-xl font-bold">
                {statsData?.confirmedOrders || 0}
              </span>
            </div>
            <LinearProgress
              variant="determinate"
              value={
                ((statsData?.confirmedOrders || 0) /
                  (statsData?.totalOrders || 1)) *
                100
              }
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "#E5E7EB",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#0d7f3f",
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4 transition-transform duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <div className="bg-[#e6f4ea] p-3 rounded-full">
            <ShoppingBagOutlined sx={{ color: "#0d7f3f", fontSize: 28 }} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">ORDERS</h3>
            <p className="text-2xl font-bold">{statsData?.totalOrders || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4 transition-transform duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <div className="bg-[#e6f4ea] p-3 rounded-full">
            <MailOutline sx={{ color: "#0d7f3f", fontSize: 28 }} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              ENQUIRIES
            </h3>
            <p className="text-2xl font-bold">
              {statsData?.totalEnquiries || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4 transition-transform duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <div className="bg-[#e6f4ea] p-3 rounded-full">
            <AttachMoney sx={{ color: "#0d7f3f", fontSize: 28 }} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              TOTAL REVENUE
            </h3>
            <p className="text-2xl font-bold">{statsData?.totalRevenue || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4 transition-transform duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <div className="bg-[#e6f4ea] p-3 rounded-full">
            <GroupOutlined sx={{ color: "#0d7f3f", fontSize: 28 }} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              TOTAL USERS
            </h3>
            <p className="text-2xl font-bold">{statsData?.totalUsers || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Recent Orders
        </h2>
        <div className="mt-8">
          <DashboardOrdersTable />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
