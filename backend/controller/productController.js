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