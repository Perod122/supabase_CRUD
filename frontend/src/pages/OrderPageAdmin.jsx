import React, { useEffect, useState } from 'react';
import { useOrderStore } from '@/store/useOrder';
import { ShoppingBag, Truck, DollarSign, User, Clock, Search, Filter, ChevronDown, ArrowUpDown, XIcon } from 'lucide-react';

function OrderPageAdmin() {
  const { AllOrder, getAllOrders } = useOrderStore();
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'order_id', direction: 'desc' });
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status options for filtering
  const statusOptions = ['all', 'pending', 'processing', 'delivered', 'cancelled'];
  
  // Load orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        await getAllOrders();
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [getAllOrders]);
  
  // Filter and sort orders based on search term, status, and sort config
  useEffect(() => {
    if (!AllOrder) return;
    
    let result = [...AllOrder];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status.toLowerCase() === statusFilter);
    }
    
    // Apply search filter - search in customer name and order ID
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(order => 
        `${order.user.firstname} ${order.user.lastname}`.toLowerCase().includes(lowercasedTerm) ||
        order.order_id.toString().includes(lowercasedTerm)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      // Handle nested properties
      if (sortConfig.key === 'customer') {
        aValue = `${a.user.firstname} ${a.user.lastname}`.toLowerCase();
        bValue = `${b.user.firstname} ${b.user.lastname}`.toLowerCase();
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredOrders(result);
  }, [AllOrder, searchTerm, statusFilter, sortConfig]);
  
  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Get status color and icon
  const getStatusInfo = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> };
      case 'for delivery':
        return { color: 'bg-blue-100 text-blue-800', icon: <Truck className="w-4 h-4" /> };
      case 'delivered':
        return { color: 'bg-green-100 text-green-800', icon: <ShoppingBag className="w-4 h-4" /> };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800', icon: <DollarSign className="w-4 h-4" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <Clock className="w-4 h-4" /> };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Order Management</h1>
        <p className="text-gray-500">Manage and track all customer orders</p>
      </div>
      
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by customer name or order ID"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-full md:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 capitalize"
          >
            {statusOptions.map(status => (
              <option key={status} value={status} className="capitalize">
                {status === 'all' ? 'All Status' : status}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Order count summary */}
      <div className="mb-4 text-sm text-gray-500">
        Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
        {statusFilter !== 'all' && ` with status: ${statusFilter}`}
        {searchTerm && ` matching "${searchTerm}"`}
      </div>
      
      {/* Orders table */}
      {filteredOrders.length > 0 ? (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('customer')}
                >
                  <div className="flex items-center">
                    <span>Customer</span>
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    <span>Status</span>
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <tr key={order.order_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {order.user.firstname} {order.user.lastname}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {order.delivery_address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{order.payment_method}</div>
                    </td>
                    <td className="px-6 float-end py-4 whitespace-nowrap  space-x-2">
                    <button className="btn btn-sm btn-primary"
                    onClick={() => setSelectedOrder(order)}>
                        Details
                        </button>
                      <button className="btn btn-sm btn-primary">
                        Update
                        </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try changing your search or filter criteria' 
              : 'There are no orders in the system yet'}
          </p>
        </div>
      )}
    </div>
  );
}

export default OrderPageAdmin;