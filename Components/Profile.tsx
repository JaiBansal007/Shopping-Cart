import React from 'react';

export default function ProfilePage() {
  // Dummy data for the profile and orders
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  const pastOrders = [
    { id: 1, product: 'Product A', date: '2024-08-01', status: 'Delivered' },
    { id: 2, product: 'Product B', date: '2024-08-05', status: 'Delivered' },
  ];

  const currentOrders = [
    { id: 3, product: 'Product C', date: '2024-09-15', status: 'Shipped' },
    { id: 4, product: 'Product D', date: '2024-09-20', status: 'Processing' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Profile Page</h1>
          <div className="flex gap-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
              Logout
            </button>
            <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">
              Delete Account
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold">User Information</h2>
          <p className="mt-2">
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        {/* Current Orders Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Orders</h2>
          {currentOrders.length > 0 ? (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id} className="bg-white border-b">
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{order.product}</td>
                    <td className="px-4 py-2">{order.date}</td>
                    <td className="px-4 py-2">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No current orders.</p>
          )}
        </div>

        {/* Past Orders Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Past Orders</h2>
          {pastOrders.length > 0 ? (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {pastOrders.map((order) => (
                  <tr key={order.id} className="bg-white border-b">
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{order.product}</td>
                    <td className="px-4 py-2">{order.date}</td>
                    <td className="px-4 py-2">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No past orders.</p>
          )}
        </div>
      </div>
    </div>
  );
}
