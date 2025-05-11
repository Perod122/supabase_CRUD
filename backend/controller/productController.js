import { supabase } from "../config/db.js";

export const getProducts = async (req, res) => {
    try {
        const { data: products, error } = await supabase
            .from("Products")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Error getProducts:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const createProduct = async (req, res) => {
    const { productName, productPrice, productImage, stocks = 1 } = req.body;

    if (!validateRequiredFields(productName, productPrice, productImage)) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const newProduct = await supabase
            .from("Products")
            .insert({ productName, productPrice, productImage, stocks })
            .select()
            .single();

            if (newProduct.error) throw newProduct.error;
            
        console.log("Created product:", newProduct);
        res.status(201).json({ success: true, data: newProduct.data });
    } catch (error) {
        console.error("Error createProduct:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const { data: product, error } = await supabase
            .from("Products")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error("Error getProductById:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { productName, productPrice, productImage, stocks } = req.body;

    if (!validateRequiredFields(productName, productPrice, productImage)) {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const { data: updatedProduct, error } = await supabase
            .from("Products")
            .update({ productName, productPrice, productImage, stocks })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error("Error updateProduct:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
 export const deleteProduct = async (req, res) => {
        const {id} = req.params;
        try {
            const deletedProd = await supabase.from("Products").delete().eq("id", id)
            if (deletedProd.count === 0 ) {
                return res.status(404).json({success: false, message: "Product not found"});
            }
            console.log("Deleted Product", deletedProd);
            res.status(200).json({success: true, data: deletedProd})
        } catch (error) {
            console.log("Failed to delete a product. Try again later");
            res.status(500).json({success: false, message: "Error deleting a product"});
        }
 }
 export const deleteUserCart = async (req, res) => {
  const { id } = req.params;
  const access_token = req.cookies?.access_token;

  try {
    // 1. Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(access_token);
    if (authError) throw authError;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 2. Verify the cart item exists and belongs to this user
    const { data: cartItem, error: findError } = await supabase
      .from("cart")  // Note: lowercase table name
      .select("*")
      .eq("id", id)  // Match the UUID
      .eq("user_id", user.id)  // Verify ownership
      .single();
      
    if (findError || !cartItem) {
      console.log("Cart item not found or doesn't belong to user", { id, userId: user.id });
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    // 3. Delete the item
    const { error: deleteError } = await supabase
      .from("cart")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to delete cart item:", error);
    res.status(500).json({ success: false, message: "Error deleting cart item" });
  }
}
 export const addToCart = async (req, res) => {
    try {
      const { product_id, quantity } = req.body;
  
      // Extract token from Authorization header
      const access_token = req.cookies?.access_token;
      if (!access_token) {
        console.error("No token found in cookies");
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
  
      // Get user from Supabase using token
      const { data: { user } } = await supabase.auth.getUser(access_token);
  
      if (!user) {
        console.error("Not logged in or session invalid");
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      console.log("Adding to cart for user:", user.id);

      // Check if product exists in cart
      const { data: existingCartItem, error: findError } = await supabase
        .from("cart")
        .select("*, product:product_id(stocks)")
        .eq("user_id", user.id)
        .eq("product_id", product_id)
        .single();

      if (findError && findError.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw findError;
      }

      // If product exists, update quantity
      if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + (quantity || 1);
        
        // Check if new quantity exceeds stock
        if (existingCartItem.product && newQuantity > existingCartItem.product.stocks) {
          return res.status(400).json({ 
            success: false, 
            message: `Only ${existingCartItem.product.stocks} items available in stock` 
          });
        }

        const { data: updatedItem, error: updateError } = await supabase
          .from("cart")
          .update({ quantity: newQuantity })
          .eq("id", existingCartItem.id)
          .select()
          .single();
          
        if (updateError) throw updateError;
        
        res.status(200).json({ success: true, data: updatedItem });
      } else {
        // If product doesn't exist, insert new cart item
        const { data: newItem, error: insertError } = await supabase
          .from("cart")
          .insert({
              user_id: user.id,
              product_id: product_id,
              quantity: quantity || 1,
          })
          .select()
          .single();
          
        if (insertError) throw insertError;

        res.status(200).json({ success: true, data: newItem });
      }
    } catch (err) {
      console.error("Error in addToCart:", err.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  export const fetchUserCart = async (req, res) => {
    try {
      const access_token = req.cookies?.access_token;
      if (!access_token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
  
      // Authenticate user
      const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
      if (userError) throw userError;
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Fetch user's cart items
      const { data: cartData, error: cartError } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id)
        .order('created_at', { ascending: false }); 
  
      if (cartError) throw cartError;
  
      // Fetch associated products in parallel
      const productPromises = cartData.map(async (item) => {
        const { data: productData, error: productError } = await supabase
          .from("Products")
          .select("*")
          .eq("id", item.product_id)
          .single();
  
        if (productError) throw productError;
  
        return {
          ...productData,
          quantity: item.quantity,
          cart_id: item.id,
          created_at: item.created_at
        };
      });
  
      const productArr = await Promise.all(productPromises);
  
      return res.status(200).json({
        success: true,
        message: "User's cart fetched successfully",
        data: productArr,
      });
    } catch (error) {
      console.error("Error fetching user cart:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch user cart",
        error: error.message,
      });
    }
  };

  export const updateCartQuantity = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const access_token = req.cookies?.access_token;

    try {
      // 1. Verify user authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser(access_token);
      if (authError) throw authError;
      if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      // 2. Verify the cart item exists and belongs to this user
      const { data: cartItem, error: findError } = await supabase
        .from("cart")
        .select("*, product:product_id(stocks)")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();
        
      if (findError || !cartItem) {
        return res.status(404).json({ success: false, message: "Cart item not found" });
      }

      // 3. Check if the requested quantity is available in stock
      if (cartItem.product && quantity > cartItem.product.stocks) {
        return res.status(400).json({ 
          success: false, 
          message: `Only ${cartItem.product.stocks} items available in stock` 
        });
      }

      // 4. Update the quantity
      const { error: updateError } = await supabase
        .from("cart")
        .update({ quantity })
        .eq("id", id);

      if (updateError) throw updateError;
      
      res.status(200).json({ success: true, message: "Cart updated successfully" });
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
      res.status(500).json({ success: false, message: "Error updating cart quantity" });
    }
  };

  function validateRequiredFields(productName, productPrice, productImage) {
    return Boolean(productName && productPrice && productImage);
  }
  