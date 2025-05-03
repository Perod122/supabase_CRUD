import React from 'react'
import { Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: {
        icon: <Clock className="size-4" />,
        color: 'badge-warning',
        text: 'Pending'
      },
      completed: {
        icon: <CheckCircle className="size-4" />,
        color: 'badge-success',
        text: 'Completed'
      },
      shipped: {
        icon: <Truck className="size-4" />,
        color: 'badge-info',
        text: 'Shipped'
      },
      cancelled: {
        icon: <XCircle className="size-4" />,
        color: 'badge-error',
        text: 'Cancelled'
      }
    };
  
    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
  
    return (
      <span className={`badge gap-1 ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };
const OrderCard = ({ order }) => (
    <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="card-title text-lg">
              Order #{order.order_id}
            </h3>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <h4 className="font-semibold text-sm">Payment</h4>
            <p className="capitalize">{order.payment_method}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">Delivery</h4>
            <p className="line-clamp-2">{order.delivery_address}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">Total Items</h4>
            <p>{order.items.length}</p>
          </div>
        </div>
  
        <div className="mt-4">
          <h4 className="font-semibold text-sm mb-2">Items</h4>
          <ul className="space-y-2">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span className="flex-1 truncate">
                  {item.product?.productName || 'Unknown Product'}
                </span>
                <span className="text-gray-500 ml-2">
                  × {item.qty}
                </span>
              </li>
            ))}
          </ul>
        </div>
  
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-sm btn-ghost">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
export default OrderCard