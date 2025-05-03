import { useOrderStore } from '@/store/useOrder';
import React, { useEffect } from 'react';

function UserOrder() {
  const { UserOrder, getUserOrders, loading, error } = useOrderStore();

  useEffect(() => {
    getUserOrders();
  }, [getUserOrders]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
      ) : error ? (
        <div className="alert alert-error shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error loading your cart. Please try again.</span>
        </div>
      </div>
      ) : UserOrder.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Payment Method</th>
                <th>Delivery Address</th>
                <th>Status</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {UserOrder.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.payment_method}</td>
                  <td>{order.delivery_address}</td>
                  <td>{order.status}</td>
                  <td>
                    <ul className="list-disc pl-4">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.product?.productName} (Qty: {item.qty})
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default UserOrder;
