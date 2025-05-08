import { useOrderStore } from '@/store/useOrder';
import React, { useEffect, useState, useCallback, memo, useMemo } from 'react';
import { 
  ChevronRight, 
  ShoppingBag, 
  X, 
  Package, 
  CreditCard, 
  MapPin, 
  ArrowLeft,
  Clock,
  DollarSign,
  Truck,
  Search,
  Filter,
  ChevronLeft,
  ChevronDown,
  MoreHorizontal,
  BoxIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Extracted OrderItem component for better performance and organization
const OrderItem = memo(({ item }) => {
  return (
    <li className="flex items-start gap-4 p-4 hover:bg-base-200 rounded-lg transition-colors border border-base-200">
      <div className="relative w-20 h-20 overflow-hidden rounded-lg bg-base-300">
        <img
          src={item.product?.productImage || '/placeholder-image.png'}
          alt={item.product?.productName}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/placeholder-image.png';
            e.target.onerror = null;
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold truncate">{item.product?.productName}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-primary font-medium">₱{item.price.toFixed(2)}</span>
          <span className="badge">Qty: {item.qty}</span>
        </div>
        <div className="mt-1 text-right">
          <span className="font-semibold">₱{(item.price * item.qty).toFixed(2)}</span>
        </div>
      </div>
    </li>
  );
});

// Extracted OrderDetailsModal component
const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  // Calculate the total amount
  const totalAmount = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl relative">
        <button 
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="size-4" />
        </button>
        
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Package className="size-5 text-primary" />
            <h3 className="text-xl font-bold">Order #{order.order_id}</h3>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-base-content/70" />
              <span>{order.status}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-base-content/70" />
              <span>{order.delivery_address}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <CreditCard className="size-4 text-base-content/70" />
              <span className="capitalize">{order.payment_method}</span>
            </div>
          </div>
        </div>

        <div className="divider my-2">Items</div>

        <div className="max-h-[400px] overflow-y-auto pr-1">
          <ul className="space-y-3">
            {order.items.map((item, index) => (
              <OrderItem key={index} item={item} />
            ))}
          </ul>
        </div>

        <div className="mt-6 pt-4 border-t border-base-200 space-y-2">
          <div className="flex justify-between">
            <span className="text-base-content/70">Subtotal</span>
            <span>₱{totalAmount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-base-content/70">Shipping</span>
            <span>{order.shipping_fee ? `₱${order.shipping_fee.toFixed(2)}` : 'Free'}</span>
          </div>
          
          <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t border-base-200">
            <span>Total</span>
            <span className="text-primary">₱{totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="modal-action">
          <button className="btn btn-neutral" onClick={onClose}>Close</button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

// Extracted OrderCard component
const OrderCard = memo(({ order, onViewDetails }) => {
  // Calculate the total amount
  const totalAmount = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
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
  const statusInfo = getStatusInfo(order.status);
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all border border-base-200/50 rounded-lg overflow-hidden">
      <div className="card-body p-4 sm:p-5">
        {/* Mobile Layout (Stacked) */}
        <div className="md:hidden space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Package className="size-5 text-primary" />
              <span className="font-semibold">Order #{order.order_id}</span>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.icon}
              <span className="ml-1 capitalize">{order.status}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="size-4 flex-shrink-0 text-base-content/70" />
            <span className="line-clamp-1">{order.delivery_address}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="size-4 flex-shrink-0 text-base-content/70" />
            <span className="capitalize">{order.payment_method}</span>
          </div>
          
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-base-200">
            <div>
              <span className="text-xs text-base-content/70">Total</span>
              <p className="font-semibold">₱{totalAmount.toFixed(2)}</p>
            </div>
            
            <button 
              className="btn btn-sm btn-primary"
              onClick={() => onViewDetails(order)}
              aria-label={`View details for order #${order.order_id}`}
            >
              View Details <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Desktop Layout (Grid) */}
        <div className="hidden md:grid grid-cols-12 gap-4 items-center">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <Package className="size-5 text-primary" />
              <span className="font-medium">#{order.order_id}</span>
            </div>
          </div>

          <div className="col-span-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.icon}
            <span className="ml-1 capitalize">{order.status}</span>
            </span>
          </div>

          {/* Delivery Address */}
          <div className="col-span-3 flex items-center gap-2">
            <MapPin className="size-4 text-base-content/70 flex-shrink-0" />
            <span className="text-sm truncate">{order.delivery_address}</span>
          </div>

          {/* Payment Method */}
          <div className="col-span-2 flex items-center gap-2">
            <CreditCard className="size-4 text-base-content/70 flex-shrink-0" />
            <span className="capitalize text-sm">{order.payment_method}</span>
          </div>

          {/* Total Price */}
          <div className="col-span-2 text-right">
            <span className="text-sm text-base-content/70">Total</span>
            <p className="font-semibold">₱{totalAmount.toFixed(2)}</p>
          </div>
          
          <div className="col-span-1 flex justify-end">
            <button 
              className="btn btn-sm btn-primary"
              onClick={() => onViewDetails(order)}
              aria-label={`View details for order #${order.order_id}`}
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Search and Filter component
const OrderSearchFilters = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange
}) => {
  const statuses = ['All', 'Pending', 'For Delivery', 'Delivered', 'Cancelled'];
  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'total', label: 'Total Amount' },
    { value: 'order_id', label: 'Order ID' }
  ];
  
  return (
    <div className="bg-base-100 p-4 rounded-lg shadow mb-6 border border-base-200/50">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="size-4 text-base-content/50" />
            </div>
            <input
              type="text"
              className="input input-bordered w-full pl-10"
              placeholder="Search by order number or address..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter Dropdown */}
        <div className="w-full md:w-48">
          <div className="dropdown w-full">
            <div tabIndex={0} role="button" className="btn btn-outline w-full flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Filter className="size-4" />
                <span>{statusFilter === '' ? 'All Status' : statusFilter}</span>
              </div>
              <ChevronDown className="size-4" />
            </div>
            <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-full">
              {statuses.map((status) => (
                <li key={status}>
                  <button 
                    onClick={() => onStatusFilterChange(status === 'All' ? '' : status)}
                    className={status === (statusFilter || 'All') ? 'active' : ''}
                  >
                    {status}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sort By Dropdown */}
        <div className="w-full md:w-48">
          <div className="dropdown w-full">
            <div tabIndex={0} role="button" className="btn btn-outline w-full flex justify-between items-center">
              <span>Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}</span>
              <ChevronDown className="size-4" />
            </div>
            <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-full">
              {sortOptions.map((option) => (
                <li key={option.value}>
                  <button 
                    onClick={() => onSortChange(option.value)}
                    className={sortBy === option.value ? 'active' : ''}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sort Order Button */}
        <button 
          className="btn btn-outline md:w-12"
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          title={sortOrder === 'asc' ? 'Ascending Order' : 'Descending Order'}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  );
};

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

// State statuses
const OrderStates = {
  LOADING: 'loading',
  ERROR: 'error',
  EMPTY: 'empty',
  SUCCESS: 'success'
};

// Main component
function UserOrder() {
  const { UserOrder, getUserOrders, loading, error } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('date'); // Default sort by date
  const [sortOrder, setSortOrder] = useState('desc'); // Default newest first
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    getUserOrders();
  }, [getUserOrders]);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  const handleCloseModal = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  const handleViewDetails = useCallback((order) => {
    setSelectedOrder(order);
  }, []);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    if (!UserOrder || UserOrder.length === 0) return [];
    
    return UserOrder.filter(order => {
      // Apply search filter
      const searchMatch = 
        searchTerm === '' || 
        order.order_id.toString().includes(searchTerm) ||
        order.delivery_address.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply status filter
      const statusMatch = 
        statusFilter === '' || 
        order.status.toLowerCase() === statusFilter.toLowerCase();
      
      return searchMatch && statusMatch;
    }).sort((a, b) => {
      // Apply sorting
      let comparison = 0;
      
      if (sortBy === 'date') {
        // Sort by date logic (assuming there's a date field, or using order_id as proxy)
        comparison = a.order_id - b.order_id;
      } else if (sortBy === 'total') {
        // Calculate total amount for sorting
        const totalA = a.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const totalB = b.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
        comparison = totalA - totalB;
      } else if (sortBy === 'order_id') {
        comparison = a.order_id - b.order_id;
      }
      
      // Apply sort order
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [UserOrder, searchTerm, statusFilter, sortBy, sortOrder]);
  
  // Paginate orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);
  
  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  }, [filteredOrders, itemsPerPage]);

  // Determine current state
  let currentState = OrderStates.SUCCESS;
  if (loading) currentState = OrderStates.LOADING;
  else if (error) currentState = OrderStates.ERROR;
  else if (UserOrder.length === 0) currentState = OrderStates.EMPTY;
  else if (filteredOrders.length === 0) currentState = OrderStates.EMPTY;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          title="Go back"
          className="btn btn-circle btn-ghost hover:bg-base-300"
          onClick={handleGoBack}
          aria-label="Go back"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold">Your Orders</h1>
      </div>

      {/* Search and Filtering - Only show when we have orders */}
      {currentState === OrderStates.SUCCESS && (
        <OrderSearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
      )}

      {/* Different states */}
      {currentState === OrderStates.LOADING && (
        <div className="flex flex-col justify-center items-center h-64 gap-3">
          <span className="loading loading-spinner loading-lg text-base-content"></span>
          <p className="text-base-content/70">Loading your orders...</p>
        </div>
      )}

      {currentState === OrderStates.ERROR && (
        <div className="alert alert-error shadow-lg max-w-2xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">Error loading orders</h3>
            <div className="text-xs">Please try again later or contact support</div>
          </div>
          <button className="btn btn-sm" onClick={getUserOrders}>Retry</button>
        </div>
      )}

      {currentState === OrderStates.EMPTY && (
        <div className="text-center py-16 max-w-md mx-auto">
          <div className="bg-base-200 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="size-12 text-base-content/50" />
          </div>
          {UserOrder.length === 0 ? (
            <>
              <h2 className="text-2xl font-semibold mb-3">No Orders Found</h2>
              <p className="text-base-content/70 mb-6">You haven't placed any orders yet.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/user')}
              >
                Start Shopping
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-3">No Matching Orders</h2>
              <p className="text-base-content/70 mb-6">Try adjusting your search or filters.</p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setSortBy('date');
                  setSortOrder('desc');
                }}
              >
                Clear Filters
              </button>
            </>
          )}
        </div>
      )}

      {/* Orders List */}
      {currentState === OrderStates.SUCCESS && (
        <>
          <div className="space-y-4">
            {paginatedOrders.map((order) => (
              <OrderCard 
                key={order.order_id} 
                order={order} 
                onViewDetails={handleViewDetails}
              />
            ))}
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
          <div className="text-center text-sm text-base-content/70 mt-4">
            Showing {paginatedOrders.length} of {filteredOrders.length} orders
          </div>
        </>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}

export default UserOrder;