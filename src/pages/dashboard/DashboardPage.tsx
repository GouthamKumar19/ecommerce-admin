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
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h1>

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

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="px-6 py-4">
          <ul className="divide-y divide-gray-200">
            <li className="py-3">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    New user registered
                  </p>
                  <p className="text-sm text-gray-500">
                    John Doe (john@example.com)
                  </p>
                </div>
                <div className="text-sm text-gray-500">5 minutes ago</div>
              </div>
            </li>
            <li className="py-3">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    New order placed
                  </p>
                  <p className="text-sm text-gray-500">
                    Order #12345 - $126.54
                  </p>
                </div>
                <div className="text-sm text-gray-500">2 hours ago</div>
              </div>
            </li>
            <li className="py-3">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Product updated
                  </p>
                  <p className="text-sm text-gray-500">
                    Smartphone XS - Stock: 23
                  </p>
                </div>
                <div className="text-sm text-gray-500">Yesterday</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
