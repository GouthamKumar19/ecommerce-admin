"use client";
import DashboardOrdersTable from "../../components/DashboardOrdersTable";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarToday, KeyboardArrowDown } from '@mui/icons-material';
import { LinearProgress } from '@mui/material'; // Import LinearProgress from MUI
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material"; // Import Menu and MenuItem from MUI
import { addDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DashboardPage = () => {
  // Chart data
  const chartData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 2000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 },
  ];

  // Add these state variables
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Add these handler functions
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Add selected option state
  const [selectedOption, setSelectedOption] = useState("SELECT");

  const handleSelect = (option: string) => {
    const displayText = {
      today: "TODAY",
      yesterday: "YESTERDAY",
      last7days: "LAST 7 DAYS",
      last30days: "LAST 30 DAYS",
      last6months: "LAST 6 MONTHS",
      lastyear: "LAST YEAR",
      lifetime: "LIFETIME"
    }[option];
    setSelectedOption(displayText || 'SELECT');
    handleClose();
  };

  // Add date range state
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

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
            {selectedOption} <KeyboardArrowDown />
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
            <MenuItem onClick={() => handleSelect("yesterday")}>Yesterday</MenuItem>
            <MenuItem onClick={() => handleSelect("last7days")}>Last 7 Days</MenuItem>
            <MenuItem onClick={() => handleSelect("last30days")}>Last 30 Days</MenuItem>
            <MenuItem onClick={() => handleSelect("last6months")}>Last 6 Months</MenuItem>
            <MenuItem onClick={() => handleSelect("lastyear")}>Last Year</MenuItem>
            <MenuItem onClick={() => handleSelect("lifetime")}>Lifetime</MenuItem>
          </Menu>
          <Popover>
            <PopoverTrigger asChild>
              <button className="border rounded-md px-4 py-2 flex items-center gap-2 bg-[#0d7f3f] text-white hover:bg-[#0d7f3f]/90">
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM dd, y")} -{" "}
                      {format(dateRange.to, "MMM dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM dd, y")
                  )
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
                onSelect={setDateRange}
                numberOfMonths={2}
                className="flex"
                classNames={{
                  day_selected: "bg-[#0d7f3f] text-white hover:bg-[#0d7f3f] hover:text-white",
                  day_today: "bg-[#0d7f3f] text-white",
                  day_range_middle: "bg-[#0d7f3f]/20 text-gray-700",
                  day_range_start: "bg-[#0d7f3f] text-white",
                  day_range_end: "bg-[#0d7f3f] text-white"
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Product Sales Chart - Takes up 2/3 of the width */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">PRODUCT SALES</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d7f3f" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0d7f3f" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                  tick={{ fill: '#666', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                  tick={{ fill: '#666', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    padding: '10px 14px'
                  }}
                  labelStyle={{ color: '#666', marginBottom: '5px' }}
                  itemStyle={{ color: '#10B981' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#0d7f3f" 
                  strokeWidth={2}
                  fill="url(#colorSales)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Cards - Takes up 1/3 of the width */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-600">NEW ORDER</h3>
              <span className="text-xl font-bold">500</span>
            </div>
            <LinearProgress 
              variant="determinate" 
              value={70} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                backgroundColor: '#E5E7EB',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#0d7f3f',
                }
              }} 
            />
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-600">CONFIRMED ORDER</h3>
              <span className="text-xl font-bold">200</span>
            </div>
            <LinearProgress 
              variant="determinate" 
              value={40} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                backgroundColor: '#E5E7EB',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#0d7f3f',
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">ORDERS</h3>
          <p className="text-2xl font-bold">1000</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">ENQUIRIES</h3>
          <p className="text-2xl font-bold">1000</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">TOTAL REVENUE</h3>
          <p className="text-2xl font-bold">1000</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">TOTAL USERS</h3>
          <p className="text-2xl font-bold">1000</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Orders</h2>
        <div className="mt-8">
          <DashboardOrdersTable />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
