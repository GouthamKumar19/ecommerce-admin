"use client";
import DashboardOrdersTable from "../../components/DashboardOrdersTable";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarToday, KeyboardArrowDown } from '@mui/icons-material';
import { LinearProgress } from '@mui/material';

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

  return (
    <div>
      {/* Top Controls */}
      <div className="flex justify-between mb-6">
        <div></div>
        <div className="flex gap-4">
          <button className="border rounded-md px-4 py-2 flex items-center gap-2">
            SELECT <KeyboardArrowDown />
          </button>
          <button className="border rounded-md px-4 py-2 flex items-center gap-2">
            DATE RANGE <CalendarToday fontSize="small" />
          </button>
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
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#10B981" 
                  fill="#D1FAE5" 
                  fillOpacity={0.8}
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
                  backgroundColor: '#10B981',
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
                  backgroundColor: '#10B981',
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
        <DashboardOrdersTable />
      </div>
    </div>
  );
};

export default DashboardPage;
