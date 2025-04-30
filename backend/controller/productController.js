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
    const { productName, productPrice, productImage } = req.body;

    if (!productName || !productPrice || !productImage) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const newProduct = await supabase
            .from("Products")
            .insert({ productName, productPrice, productImage })
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
    const { productName, productPrice, productImage } = req.body;

    if (!productName || !productPrice || !productImage) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const { data: updatedProduct, error } = await supabase
            .from("Products")
            .update({ productName, productPrice, productImage })
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
 export const addToCart = async (req, res) => {
    try {
      const { product_id , quantity } = req.body;
  
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

      const insertResult = await supabase
        .from("cart")
        .insert({
            user_id: user.id,
            product_id: product_id,
            quantity: quantity || 1,
        })
        .select()
        .single();
        
        if (insertResult.error) {
        console.error("Insert error:", insertResult.error.message);
        return res.status(500).json({ success: false, error: insertResult.error.message });
        }

        res.status(200).json({ success: true, data: insertResult.data });

    } catch (err) {
      console.error("Error in addToCart:", err.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  export const fetchUserCart = async  (req, res) => {
    try {
        const access_token = req.cookies?.access_token;
        if (!access_token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
          }
        
        const { data: {user}, error: userError } = await supabase.auth.getUser(access_token)
        if(userError) throw userError;
        if(!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }


        // Fetch all cart items for the current user
        const { data: cartData, error: cartError } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id);

        if (cartError) throw cartError;

        // Now fetch the product details for each item in parallel using Promise.all
        const productPromises = cartData.map(async (item) => {
        const { data: productData, error: productError } = await supabase
        .from("Products")
        .select("*")
        .eq("id", item.product_id) // use item.product_id instead of item.id
        .single(); // assuming product ID is unique

        if (productError) throw productError;



        return {
        ...productData,
        quantity: item.quantity, // include quantity from cart if needed
        cart_id: item.id         // include cart item ID for later reference
        };
        });

        const productArr = await Promise.all(productPromises);

        // This returns  me an array of items(objcects) with ids
        // const {data: cartData, error: cartError } = await supabase
        // .from("cart")
        // .select("*")
        // .eq("user_id", user.id);
        
        // if(cartError) throw cartError;
        // console.log(cartData)

        // // Now i need to go through the products tables for each item, and get the item
        // // and push to the product array

        // const productArr = []
        // cartData.map(async (item) => {
        //     const {data: productData, error: productError } = await supabase
        //     .from("Products")
        //     .select("*")
        //     .eq("id", item.id);
        //     console.log(item)
        //     if(productError) throw productError;
        //     else productArr.push(productData)

        // })

        // console.log(`product array: ${productArr}`)
        

        // // const {data: productData, error: productError } = await supabase
        // // .from("Products")
        // // .select("*")
        // // .eq("id", cartData[0].id);
        
        // // if(productError) throw productError;
        
        // // console.log("Product Cart fetched success:", productData);

        // // return res.status(200).json({ success: true, message: "Users Cart Fetch Successfully", data: productData });
        return res.status(200).json({ success: true, message: "Users Cart Fetch Successfully", data: productArr });
    } catch (error) {
        
    }
  }
  
  