import DeleteConfirmationDialog from '@/components/DeleteDialog';
import { useProductStore } from '@/store/useProductStore';
import { ArrowLeftIcon, ShoppingBag, Plus, Minus, Trash2Icon, Package } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '@/store/useOrder';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Cart Item Component
const CartItem = ({ item, onDelete, onQuantityChange }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(item.cart_id);
    setIsDeleting(false);
  };
  
  const handleQuantityChange = async (newQuantity) => {
    // Don't allow negative quantities or zero
    if (newQuantity < 1) return;
    
    // Check if we're exceeding stock limits
    if (newQuantity > item.stocks) {
      toast.error(`Only ${item.stocks} items available in stock`);
      return;
    }
    
    setIsUpdating(true);
    setQuantity(newQuantity);
    
    try {
      await onQuantityChange(item.cart_id, newQuantity);
    } catch (error) {
      // If there's an error, reset to previous quantity
      setQuantity(item.quantity || 1);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-start shadow-lg gap-4 p-4 hover:bg-base-200 rounded-lg transition-colors border border-base-200"
    >
      <img
        src={item.productImage || 'https://via.placeholder.com/150'}
        alt={item.productName}
        className="w-20 h-20 object-cover rounded-lg"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold truncate">{item.productName}</h2>
        <p className="text-base-content font-bold">₱{item.productPrice.toFixed(2)}</p>
        
        <div className="flex items-center mt-2 gap-2">
          <button 
            className="btn btn-xs btn-circle btn-ghost hover:bg-base-300"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={isDeleting || isUpdating || quantity <= 1}
          >
            {isUpdating ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Minus className="size-4" />
            )}
          </button>
          <span className="px-2 min-w-[32px] text-center font-medium">{quantity}</span>
          <button 
            className="btn btn-xs btn-circle btn-ghost hover:bg-base-300"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isDeleting || isUpdating || quantity >= item.stocks}
          >
            {isUpdating ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Plus className="size-4" />
            )}
          </button>
          
          {item.stocks <= 5 && (
            <span className="text-xs text-warning font-medium ml-2">
              {item.stocks === quantity ? 'Max stock' : `${item.stocks} left`}
            </span>
          )}
        </div>
      </div>
      <DeleteConfirmationDialog
        onConfirm={handleDelete}
        trigger={
          <button 
            className="btn btn-sm btn-error btn-outline hover:bg-error hover:text-error-content"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Trash2Icon className="size-4" />
            )}
          </button>
        }
      />
    </motion.div>
  );
};

// Order Summary Component
const OrderSummary = ({ cart, subtotal, shippingFee, total, paymentMethod, setPaymentMethod, deliveryAddress, setDeliveryAddress, onPlaceOrder, placingOrder }) => {
  return (
    <div className="bg-base-100 rounded-xl shadow-sm p-6 sticky top-24 border border-base-300">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({cart.length} items)</span>
          <span className="font-medium">₱{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shippingFee === 0 ? (
              <span className="text-success">Free</span>
            ) : (
              `₱${shippingFee.toFixed(2)}`
            )}
          </span>
        </div>
        <div className="divider my-1"></div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-base-content">₱{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="COD">Cash on Delivery</option>
          <option value="Credit Card">Credit Card</option>
          <option value="PayPal">PayPal</option>
        </select>

        <textarea
          placeholder="Delivery Address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          className="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
          rows={3}
        />

        <button 
          className="btn btn-primary w-full hover:scale-[1.02] transition-transform" 
          onClick={onPlaceOrder}
          disabled={placingOrder || !deliveryAddress.trim()}
        >
          {placingOrder ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <>
              <ShoppingBag className="size-5 mr-2" />
              Place Order
            </>
          )}
        </button>
      </div>
      
      {subtotal < 500 && (
        <div className="mt-4 text-sm text-center text-gray-500">
          Add ₱{(500 - subtotal).toFixed(2)} more for free shipping
        </div>
      )}
    </div>
  );
};

// Empty Cart Component
const EmptyCart = ({ onContinueShopping }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-12 flex-1"
  >
    <Package className="mx-auto size-16 text-gray-400 mb-4" />
    <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
    <p className="text-gray-500 mb-6">Looks like you haven't added any items yet</p>
    <button 
      onClick={onContinueShopping}
      className="btn btn-primary hover:scale-[1.02] transition-transform"
    >
      Continue Shopping
    </button>
  </motion.div>
);

function CartPage() {
  const navigate = useNavigate();
  const { cart, loading, error, fetchUserCart, deleteUserCart, clearCart, updateCartQuantity } = useProductStore();
  const { placeOrder, loading: placingOrder } = useOrderStore();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      toast.error("Please enter delivery address");
      return;
    }

    try {
      const order = await placeOrder({ 
        cart,
        paymentMethod, 
        deliveryAddress 
      });
      
      if (order) {
        clearCart();
        toast.success("Order placed successfully!");
        navigate(`/mycart`);
      }
    } catch (error) {
      toast.error(error.message || "Failed to place order");
    }
  };

  useEffect(() => {
    fetchUserCart();
  }, [fetchUserCart]);

  const sortedCart = [...cart].sort((a, b) => b.cart_id - a.cart_id);
  const subtotal = sortedCart.reduce((sum, item) => sum + (item.productPrice * (item.quantity || 1)), 0);
  const shippingFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Header */}
      <div className="bg-base-100 border-b border-base-300 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              title='Go back'
              className="btn sm:ml-56 btn-ghost hover:bg-base-200 rounded-full p-2 transition-colors"
              onClick={() => navigate(-1)}
            >
              <ArrowLeftIcon className="size-5" />
            </button>
            <h1 className="text-xl font-bold ml-2">My Shopping Cart</h1>
            <div className="badge badge-primary sm:mr-48 ml-auto">
              {sortedCart.length} {sortedCart.length === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-4 max-w-4xl flex flex-col lg:flex-row gap-6 pb-20 lg:pb-4">
        {loading ? (
          <div className="flex-1 w-full flex flex-col justify-center items-center h-64 space-y-4">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="text-base-content/70 font-medium">Loading Cart...</p>
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
        ) : sortedCart.length === 0 ? (
          <EmptyCart onContinueShopping={() => navigate('/user')} />
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto lg:pr-2">
              <div className="bg-base-100 shadow-sm p-4 border border-base-300 rounded-xl">
                <AnimatePresence>
                  <div className="space-y-4">
                    {sortedCart.map((item) => (
                      <CartItem
                        key={item.cart_id}
                        item={item}
                        onDelete={deleteUserCart}
                        onQuantityChange={updateCartQuantity}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              </div>
            </div>

            {/* Order Summary */}
            <div className="hidden lg:block lg:w-80">
              <OrderSummary
                cart={sortedCart}
                subtotal={subtotal}
                shippingFee={shippingFee}
                total={total}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                deliveryAddress={deliveryAddress}
                setDeliveryAddress={setDeliveryAddress}
                onPlaceOrder={handlePlaceOrder}
                placingOrder={placingOrder}
              />
            </div>
          </>
        )}
      </div>

      {/* Mobile Checkout */}
      {sortedCart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 shadow-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold">₱{total.toFixed(2)}</div>
              <div className="text-xs text-gray-500">
                {shippingFee === 0 ? 'Free shipping' : `+₱${shippingFee.toFixed(2)} shipping`}
              </div>
            </div>
            <button 
              className="btn btn-primary flex-1 max-w-[200px] hover:scale-[1.02] transition-transform"
              onClick={() => {
                document.getElementById('mobile_checkout_modal').showModal();
              }}
            >
              <ShoppingBag className="size-5 mr-2" />
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Mobile Checkout Modal */}
      <dialog id="mobile_checkout_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Complete Your Order</h3>
          
          <div className="space-y-4 mt-4">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="COD">Cash on Delivery</option>
              <option value="Credit Card">Credit Card</option>
              <option value="GCash">GCash</option>
            </select>

            <textarea
              placeholder="Delivery Address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />

            <button 
              className="btn btn-primary w-full hover:scale-[1.02] transition-transform" 
              onClick={() => {
                handlePlaceOrder();
                document.getElementById('mobile_checkout_modal').close();
              }}
              disabled={placingOrder || !deliveryAddress.trim()}
            >
              {placingOrder ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default CartPage;