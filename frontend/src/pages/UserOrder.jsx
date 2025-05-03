import { useOrderStore } from '@/store/useOrder';
import React, { useEffect, useState } from 'react';
import { ChevronRight, ShoppingBag, X, Package, CreditCard, MapPin, ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function UserOrder() {
  const { UserOrder, getUserOrders, loading, error } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

  useEffect(() => {
    getUserOrders();
  }, [getUserOrders]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg max-w-2xl mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error loading orders. Please try again.</span>
      </div>
    );
  }

  if (UserOrder.length === 0) {
    return (
      <div className="text-center py-12 max-w-2xl mx-auto">
        <ShoppingBag className="mx-auto size-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
      <button
              title='Go back'
              className="btn btn-ghost hover:bg-base-300 rounded-full p-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeftIcon className="size-5" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold">Your Orders</h1>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {UserOrder.map((order) => (
          <div 
            key={order.order_id} 
            className="card bg-base-100 shadow-xs hover:shadow-sm transition-shadow border border-base-200/50 rounded-lg"
          >
            <div className="card-body p-4 sm:p-5">
              {/* Mobile Layout (Stacked) */}
              <div className="md:hidden space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Package className="size-5 text-primary/80" />
                    <span className="font-semibold">Order #{order.order_id}</span>
                  </div>
                  <span className="badge badge-sm badge-neutral">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 flex-shrink-0" />
                  <span className="line-clamp-1">{order.delivery_address}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="size-4 flex-shrink-0" />
                  <span className="capitalize">{order.payment_method}</span>
                </div>
                
                <button 
                  className="btn btn-sm btn-ghost self-end -mr-2 mt-1"
                  onClick={() => setSelectedOrder(order)}
                >
                  Details <ChevronRight className="size-4" />
                </button>
              </div>

              {/* Desktop Layout (Grid) */}
              <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2 flex items-center gap-2">
                    <Package className="w-5 h-5 text-base-content" />
                    <span className="font-medium text-sm truncate">{order.status}</span>
                </div>

                {/* Delivery Address */}
                <div className="col-span-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm truncate">{order.delivery_address}</span>
                </div>

                {/* Payment Method */}
                <div className="col-span-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="capitalize text-sm">{order.payment_method}</span>
                </div>

                {/* Total Price */}
                <div className="col-span-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm font-medium">
                    ₱{order.items.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2)}
                    </span>
                </div>

                {/* Item Count */}
                <div className="col-span-1 flex justify-center">
                    <span className="badge badge-neutral text-xs">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </span>
                </div>
                
                
                <div className="col-span-1 flex justify-end">
                  <button 
                    className="btn btn-sm btn-ghost hover:bg-base-200"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Ordered Items</h3>
              <button 
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setSelectedOrder(null)}
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto lg:pr-2">
          

              <div>
                <ul className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <li key={index} className="flex items-start shadow-lg gap-4 p-4 hover:bg-base-200 rounded-lg transition-colors border border-base-200">
                    <img
                        src={item.product?.productImage || 'https://via.placeholder.com/150'}
                        alt={item.product?.productName}
                        className="w-20 h-20 object-cover rounded-lg"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold truncate">{item.product?.productName}</h2>
                        <div className="flex items-center mt-2 gap-2">
                          <span className="px-2 min-w-[20px] text-center">₱{(item.price * item.qty).toFixed(2)}</span>
                        </div>
                        <div className="float-end flex">
                          <span className="px-2 min-w-[20px] text-center">x{item.qty}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-2 border-t border-base-200">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>
                      ₱{selectedOrder.items.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserOrder;