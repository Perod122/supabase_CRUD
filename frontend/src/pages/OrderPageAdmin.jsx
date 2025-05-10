import React, { useEffect, useState, useMemo } from 'react';
import { useOrderStore } from '@/store/useOrder';
import { ShoppingBag, Truck, DollarSign, User, Clock, Search, Filter, ChevronDown, ArrowUpDown, XIcon, X, ChevronLeft, ChevronRight, MoreHorizontal, BoxIcon } from 'lucide-react';
import UpdateOrderModal from '@/components/UpdateOrderModal';

function OrderPageAdmin() {
  const { AllOrder, getAllOrders } = useOrderStore();
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'order_id', direction: 'desc' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectUpdate, setSelectUpdate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      case 'shipped':
        return { color: 'bg-green-100 text-green-800', icon: <BoxIcon className="w-4 h-4" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <Clock className="w-4 h-4" /> };
    }
  };

  // Paginate orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  }, [filteredOrders, itemsPerPage]);

  // Pagination component
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];
    
    // Add logic to show limited page numbers with ellipsis for large numbers
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate start and end of pages to show
      let startPage = Math.max(2, currentPage - 2);
      let endPage = Math.min(totalPages - 1, currentPage + 2);
      
      // Add ellipsis if needed before startPage
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed after endPage
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always include last page
      pages.push(totalPages);
    }
    
    return (
      <nav role="navigation" aria-label="pagination" className="mx-auto flex w-full justify-center mt-8">
        <ul className="flex flex-row items-center gap-1">
          <li>
            <button 
              className="inline-flex items-center justify-center gap-1 h-9 px-4 py-2 text-sm font-medium rounded-md border border-input bg-base-100 hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
          </li>
          
          {pages.map((page, index) => (
            <li key={page === '...' ? `ellipsis-${index}` : page}>
              {page === '...' ? (
                <span className="flex h-9 w-9 items-center justify-center">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More pages</span>
                </span>
              ) : (
                <button
                  className={`inline-flex items-center justify-center h-9 w-9 text-sm font-medium rounded-md ${
                    currentPage === page 
                      ? 'bg-base-100 text-base-content hover:bg-accent hover:text-accent-foreground border border-input' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => onPageChange(page)}
                  aria-current={currentPage === page ? 'page' : undefined}
                  aria-label={`Page ${page}`}
                >
                  {page}
                </button>
              )}
            </li>
          ))}
          
          <li>
            <button 
              className="inline-flex items-center justify-center gap-1 h-9 px-4 py-2 text-sm font-medium rounded-md border border-input bg-base-100 hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Go to next page"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
          <span className="loading loading-spinner loading-lg text-base-content"></span>
          <p className="text-base-content/70">Loading your orders...</p>
        </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-base-content">Order Management</h1>
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
            className="pl-10 pr-4 py-2 border border-gray-300 bg-base-100 text-base-content rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-full md:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-base-content" />
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
        <>
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
                {paginatedOrders.map((order) => {
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
                      <button className="btn btn-sm btn-info"
                      onClick={() => setSelectedOrder(order)}>
                          Details
                          </button>
                        <button className="btn btn-sm btn-primary"
                        onClick={() => setSelectUpdate(order)}>
                          Update
                          </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
          
          {/* Results summary */}
          <div className="text-center text-sm text-gray-500 mt-4">
            Showing {paginatedOrders.length} of {filteredOrders.length} orders
          </div>
        </>
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
      {selectUpdate && (
        <UpdateOrderModal
          order={selectUpdate}
          onClose={() => setSelectUpdate(null)}
        />
      )}
      {selectedOrder && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Ordered Items {selectedOrder.order_id}</h3>
              <button 
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setSelectedOrder(null)}
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex flex-col h-[60vh]">
              <div className="flex-1 overflow-y-auto pr-2 mb-4">
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
              </div>
              
              <div className="sticky bottom-0 bg-base-100 pt-4 border-t border-base-content ">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>
                    ₱{selectedOrder.items.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderPageAdmin;