/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import { BASE_URL } from '../utils/api';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/get-orders`,{
          headers:{
            'Authorization': `Bearer ${token}`,
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    };
    return date.toLocaleString('en-US', options).replace(',', ' |');
  };

  if (loading) {
    return (
      <div className="w-full rounded-md shadow-lg p-2 sm:p-3 bg-white flex justify-center items-center h-32">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-md shadow-lg p-2 sm:p-3 bg-white flex justify-center items-center h-32">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full rounded-md shadow-lg p-6 sm:p-8 bg-white flex flex-col justify-center items-center min-h-64 text-center">
        <div className="mb-4 bg-gray-100 rounded-full p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
        <p className="text-gray-600 mb-6 max-w-md">You haven't placed any orders yet. Discover our premium card collection and start your journey today!</p>
        <a href="/all-cards" className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 rounded-lg shadow-md transition-all duration-200 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Browse Cards Now</span>
        </a>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-md shadow-lg p-2 sm:p-3 bg-white">
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="text-left">
            <th className="px-2 py-2 text-xs lg:text-sm font-medium hero_h1 text-gray-500 whitespace-nowrap">
              ORDER ID
            </th>
            <th className="px-2 py-2 text-xs lg:text-sm font-medium hero_h1 text-gray-500 whitespace-nowrap">
              DATE & TIME
            </th>
            <th className="px-2 py-2 text-xs lg:text-sm font-medium hero_h1 text-gray-500 whitespace-nowrap">
              PRODUCT & PRICE
            </th>
            <th className="px-2 py-2 text-xs lg:text-sm font-medium hero_h1 text-gray-500 whitespace-nowrap">
              STATUS
            </th>
            <th className="px-2 py-2 text-xs lg:text-sm font-medium hero_h1 text-gray-500 whitespace-nowrap">
              ACTION
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-t border-gray-100">
              <td className="px-2 py-2 text-xs lg:text-sm font-semibold whitespace-nowrap">
                #{order._id.slice(-6).toUpperCase()}
              </td>
              <td className="px-2 py-2 text-xs lg:text-sm text-gray-800 font-semibold whitespace-nowrap">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-2 py-2 text-xs lg:text-sm text-gray-800 font-semibold whitespace-nowrap">
                <div className="flex flex-col">
                  <span>{order.cardPackId.name}</span>
                  <span>${order.amount.toFixed(2)}</span>
                </div>
              </td>
              <td className="px-2 py-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs lg:text-sm font-medium ${
                  order.status === 'requires_payment_method' 
                    ? 'text-yellow-600 border border-yellow-600' 
                    : 'text-gray-600 border border-gray-300'
                } whitespace-nowrap`}>
                  {order.status === 'requires_payment_method' ? 'Payment Required' : order.status}
                </span>
              </td>
              <td className="px-2 py-2">
                <button className="px-4 py-2 text-xs lg:text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 rounded-lg cursor-pointer transition-colors whitespace-nowrap">
                  {order.status === 'requires_payment_method' ? 'Complete Payment' : 'Track Order'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;