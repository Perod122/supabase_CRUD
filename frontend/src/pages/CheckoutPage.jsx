import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrderStore } from '@/store/useOrder';
import { MapPin, CreditCard, ShoppingBag, ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { buyNowOrder, loading } = useOrderStore();
  
  // Get items from route state (from Buy Now)
  const { buyNow, items, total } = location.state || {};
  
  // Form state
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Check if this is a valid checkout session
  useEffect(() => {
    // Check if order was already completed (using sessionStorage)
    const checkoutComplete = sessionStorage.getItem(`checkout_complete_${location.key}`);
    
    if (checkoutComplete === 'true') {
      setOrderCompleted(true);
      return;
    }
    
    // Validate checkout state
    if (!buyNow || !items || !items.length) {
      navigate('/user');
      toast.error("Invalid checkout session");
    }
  }, [buyNow, items, navigate, location.key]);

  // Handler for back button
  const handleGoBack = () => {
    navigate('/user');
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      toast.error("Please enter delivery address");
      return;
    }

    try {
      const order = await buyNowOrder({
        items,
        paymentMethod,
        deliveryAddress
      });

      if (order) {
        // Mark this checkout session as completed
        sessionStorage.setItem(`checkout_complete_${location.key}`, 'true');
        setOrderCompleted(true);
        
        // Navigate to orders page
        navigate('/myorders');
      }
    } catch (error) {
      toast.error(error.message || "Failed to place order");
    }
  };

  // Calculate summary
  const subtotal = items?.reduce((sum, item) => sum + (item.productPrice * (item.quantity || 1)), 0) || 0;
  const shippingFee = subtotal > 500 ? 0 : 50;
  const orderTotal = subtotal + shippingFee;

  // If order is already completed, show an appropriate message
  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col">
        {/* Header */}
        <div className="bg-base-100 border-b border-base-300 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title='Go back'
                className="btn sm:ml-56 btn-ghost hover:bg-base-200 rounded-full p-2 transition-colors"
                onClick={handleGoBack}
              >
                <ArrowLeft className="size-5" />
              </motion.button>
              <h1 className="text-xl font-bold ml-2">Checkout</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-base-100 rounded-xl p-8 shadow-md text-center max-w-md"
          >
            <AlertCircle className="size-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-4">Order Already Processed</h2>
            <p className="mb-6 text-gray-600">
              This order has already been processed and can't be submitted again.
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
                onClick={() => navigate('/myorders')}
              >
                View My Orders
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline"
                onClick={() => navigate(-1)}
              >
                Continue Shopping
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Header */}
      <div className="bg-base-100 border-b border-base-300 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title='Go back'
              className="btn sm:ml-56 btn-ghost hover:bg-base-200 rounded-full p-2 transition-colors"
              onClick={handleGoBack}
            >
              <ArrowLeft className="size-5" />
            </motion.button>
            <h1 className="text-xl font-bold ml-2">Checkout</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <div className="bg-base-100 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <AnimatePresence>
                <div className="space-y-4">
                  {items?.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-base-200 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                        <img
                          src={item.productImage || 'https://via.placeholder.com/150'}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.productName}</h3>
                        <div className="flex justify-between mt-2">
                          <span className="text-sm">
                            ₱{Number(item.productPrice).toLocaleString()} × {item.quantity || 1}
                          </span>
                          <span className="font-semibold">
                            ₱{Number(item.productPrice * (item.quantity || 1)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Column - Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-96"
          >
            <div className="bg-base-100 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Checkout Details</h2>
              
              <div className="space-y-4">
                {/* Payment Method */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <CreditCard className="size-4" />
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="COD">Cash on Delivery</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="GCash">GCash</option>
                  </select>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <MapPin className="size-4" />
                    Delivery Address
                  </label>
                  <textarea
                    placeholder="Enter your complete delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  ></textarea>
                </div>

                {/* Price Summary */}
                <div className="mt-6 pt-4 border-t border-base-300">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Shipping</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-success">Free</span>
                      ) : (
                        `₱${shippingFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-base-300">
                    <span>Total</span>
                    <span>₱{orderTotal.toFixed(2)}</span>
                  </div>

                  {subtotal < 500 && shippingFee > 0 && (
                    <p className="text-xs text-center mt-2 text-gray-500">
                      Add ₱{(500 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                </div>

                {/* Place Order Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary w-full mt-4"
                  onClick={handlePlaceOrder}
                  disabled={loading || !deliveryAddress.trim()}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <ShoppingBag className="size-5 mr-2" />
                      Place Order
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage; 