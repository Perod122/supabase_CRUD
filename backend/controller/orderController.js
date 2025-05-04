import { supabase } from "../config/db.js";

/**
 * Controller to handle order placement
 */
export const placeOrder = async (req, res) => {
  const { cart, paymentMethod, deliveryAddress } = req.body;
  const access_token = req.cookies?.access_token;

  try {
    // Authenticate user
    const user = await authenticateUser(access_token);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Validate request data
    if (!validateOrderRequest(cart, paymentMethod, deliveryAddress)) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Create order record
    const order = await createOrder(user.id, paymentMethod, deliveryAddress);
    if (!order) {
      throw new Error("Failed to create order");
    }

    // Create order items
    await createOrderItems(order.order_id, cart);

    // Clear user's cart
    await clearUserCart(user.id);

    // Return success response
    return res.status(200).json({
      success: true,
      order,
      message: "Order placed successfully"
    });
  } catch (error) {
    console.error("Order placement error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to place order"
    });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }

    // For each order, fetch the corresponding user profile
    const ordersWithUser = await Promise.all(
      orders.map(async (order) => {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('firstname, lastname')
          .eq('id', order.owner_id)
          .single();

        if (userError) {
          throw userError;
        }

        return {
          ...order,
          user: userData,
        };
      })
    );

    return res.status(200).json({
      success: true,
      orders: ordersWithUser,
      message: "Orders fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const access_token = req.cookies?.access_token;
    const user = await authenticateUser(access_token);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Step 1: Fetch user's orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }

    // Step 2: Fetch order_items and products for each order
    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        // Get order_items for this order
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('*, product:product_id(*)') // Join with products via foreign key
          .eq('order_id', order.order_id);

        if (itemsError) throw itemsError;

        return {
          ...order,
          items,
        };
      })
    );

    console.log("User orders fetched successfully:", detailedOrders);
    // Step 3: Return structured order with items and product info
    return res.status(200).json({
      success: true,
      data: detailedOrders,
      message: "Orders fetched successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders"
    });
  }
};

/**
 * Authenticate user based on access token
 * @param {string} access_token - User access token
 * @returns {Promise<Object|null>} - Promise resolving to user object or null if authentication fails
 */
async function authenticateUser(access_token) {
  if (!access_token) return Promise.resolve(null);
  
  const { data: { user }, error } = await supabase.auth.getUser(access_token);
  if (error || !user) return Promise.resolve(null);
  
  return Promise.resolve(user);
}

/**
 * Validate order request data
 * @param {Array} cart - Cart items
 * @param {string} paymentMethod - Payment method
 * @param {Object} deliveryAddress - Delivery address
 * @returns {boolean} - Validation result
 */
function validateOrderRequest(cart, paymentMethod, deliveryAddress) {
  return Boolean(cart?.length && paymentMethod && deliveryAddress);
}

/**
 * Create a new order in the database
 * @param {string} userId - User ID
 * @param {string} paymentMethod - Payment method
 * @param {Object} deliveryAddress - Delivery address
 * @returns {Object} - Created order
 */
async function createOrder(userId, paymentMethod, deliveryAddress) {
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      owner_id: userId,
      payment_method: paymentMethod,
      delivery_address: deliveryAddress,
      status: 'For Delivery',
    })
    .select()
    .single();

  if (error) throw error;
  return order;
}

/**
 * Create order items for an order
 * @param {string} orderId - Order ID
 * @param {Array} cartItems - Cart items
 */
async function createOrderItems(orderId, cartItems) {
  const orderItems = cartItems.map(item => ({
    order_id: orderId,
    product_id: item.id,
    qty: item.quantity || 1,
    price: item.productPrice
  }));

  const { error } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (error) throw error;
}

/**
 * Clear user's cart after order placement
 * @param {string} userId - User ID
 */
async function clearUserCart(userId) {
  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('user_id', userId);

  if (error) {
    // Log error but don't fail the order process
    console.error("Couldn't clear cart:", error);
  }
}