"use client";
import DashboardOrdersTable from "../../components/DashboardOrdersTable"; // Adjust the import path based on your file structure

const DashboardPage = () => {
  // Mock data for dashboard statistics
  const stats = [
    {
      title: "Total Users",
      value: "1,284",
      change: "+12.5%",
      changeType: "increase",
    },
    {
      title: "Revenue",
      value: "$34,743",
      change: "+8.3%",
      changeType: "increase",
    },
    {
      title: "Orders",
      value: "384",
      change: "-2.7%",
      changeType: "decrease",
    },
    {
      title: "Avg. Order Value",
      value: "$89.54",
      change: "+3.1%",
      changeType: "increase",
    },
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 transition-transform transform hover:scale-105"
          >
            <h2 className="text-lg font-medium text-gray-500">{stat.title}</h2>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  stat.changeType === "increase"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="mt-8">
        
        <DashboardOrdersTable />
      </div>
    </div>
  );
};

export default DashboardPage;
