

const OrderTable = () => {
  const orders = [
    {
      id: "#2343",
      dateTime: "May 10 | 12:44AM",
      price: "$50.00 for 1 item",
      status: "In Processing",
    },
    {
      id: "#2343",
      dateTime: "May 10 | 12:44AM",
      price: "$50.00 for 1 item",
      status: "In Processing",
    },
    {
      id: "#2343",
      dateTime: "May 10 | 12:44AM",
      price: "$50.00 for 1 item",
      status: "In Processing",
    },
    {
      id: "#2343",
      dateTime: "May 10 | 12:44AM",
      price: "$50.00 for 1 item",
      status: "In Processing",
    },
  ]

  return (
    <div className="w-full overflow-x-auto rounded-md shadow-lg p-2 sm:p-3 bg-[#FFFFFF]">
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="text-left">
            <th className="px-2 py-2 text-[10px] sm:text-xs lg:text-sm font-medium hero_h1 text-gray-500 whitespace-nowrap">
              ORDER ID
            </th>
            <th className="px-2 py-2 text-[10px] sm:text-xs lg:text-sm font-medium hero_h1 text-gray-500 whitespace-nowrap">
              DATE & TIME
            </th>
            <th className="px-2 py-2 text-[10px] sm:text-xs lg:text-sm font-medium hero_h1 text-gray-500 whitespace-nowrap">
              TOTAL PRICE
            </th>
            <th className="px-2 py-2 text-[10px] sm:text-xs lg:text-sm font-medium hero_h1 text-gray-500 whitespace-nowrap">
              STATUS
            </th>
            <th className="px-2 py-2 text-[10px] sm:text-xs lg:text-sm font-medium hero_h1 text-gray-500 whitespace-nowrap">
              ACTION
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className="border-t border-gray-100">
              <td className="px-2 py-2 text-[10px] sm:text-xs lg:text-sm font-semibold whitespace-nowrap">
                {order.id}
              </td>
              <td className="px-2 py-2 text-[10px] sm:text-xs lg:text-sm text-gray-800 font-semibold whitespace-nowrap">
                {order.dateTime}
              </td>
              <td className="px-2 py-2 text-[10px] sm:text-xs lg:text-sm text-gray-800 font-semibold whitespace-nowrap">
                {order.price}
              </td>
              <td className="px-2 py-2">
                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-1 rounded-full text-[8px] sm:text-xs lg:text-sm font-medium text-gray-600 border border-[#987C5D] whitespace-nowrap">
                  {order.status}
                </span>
              </td>
              <td className="px-2 py-2">
                <button className="px-2 sm:px-4 py-1 sm:py-2 text-[8px] sm:text-xs lg:text-sm font-medium text-white bg-[#987C5D] rounded-xl sm:rounded-2xl cursor-pointer transition-colors whitespace-nowrap">
                  Track Order
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderTable

