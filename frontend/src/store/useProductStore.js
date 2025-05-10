import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { supabase } from "../config/supabaseClient";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "";
export const useProductStore = create((set, get) => ({
    products: [],
    cart: [],
    loading: false,
    error: null,
    currentProduct: null,

    formData : {
        productName: "",
        productPrice: "",
        productImage: null,
        stocks: 1,
    },
    cartData: {
        product_id: "",
        quantity: "",
    },

    setCartData: (cartData) => set({cartData}),
    setFormData: (formData) => set ({formData}),
    resetForm: () => set({formData: {productName: "", productPrice: "", productImage: null, stocks: 1}}),

    addProduct: async (e) => {
        e.preventDefault();
        set({loading: true});
        try {
            const {formData} = get();
            
            // Upload image to Supabase Storage
            if (formData.productImage) {
                const fileExt = formData.productImage.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `shopperod/${fileName}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('balde')
                    .upload(filePath, formData.productImage);

                if (uploadError) throw uploadError;

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('balde')
                    .getPublicUrl(filePath);

                // Update formData with the public URL
                formData.productImage = publicUrl;
            }

            // Create product with image URL
            await axios.post(`${BASE_URL}/api/products/create`, formData, {
                withCredentials: true,
            });
            
            await get().fetchProducts();
            get().resetForm();
            toast.success("Product Added Successfully");
            document.getElementById("add-product-modal").close();
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error(error.message || "Something went wrong. Please try again later.");
        } finally {
            set({loading: false});
        }
    },
    fetchProducts: async () => {
        set({loading: true})

        try {
            const response = await axios.get(`${BASE_URL}/api/products`, {
                withCredentials: true, // 🔥 very important
              });
            set({products: response.data.data, error: null});
        } catch (err) {
            const errorMessage = 
                err?.response?.status === 429
                ? "Too many request"
                : "An error occured. please try again unya"

                set({error: errorMessage, products: []});
        }finally {
            set({loading: false})
        }
    },
    deleteProduct: async (id) => {
        set({loading: true})
        try {
            await axios.delete(`${BASE_URL}/api/products/${id}`, {
                withCredentials: true, // 🔥 very important
              });
            set(prev => ({products: prev.products.filter(product => product.id !== id)}));
            toast.success("Product Deleted successfully");
        } catch (error) {
            console.log("Error deleting a product",error);
            toast.error("Something went wrong. Please try again later.");
        }finally{
            set({loading: false})
        }
    },
    fetchProduct: async (id) => {
        set({loading: true})
        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`, {
                withCredentials: true, // 🔥 very important
              });
            set({currentProduct: response.data.data, formData:response.data.data, error: null})
        } catch (error) {
            set({error: "An error has occured. Please try again later", currentProduct: null});
        }finally{
            set({loading: false});
        }
    },
    updateProduct: async (id) => {
        set({loading: true})
        try {
            const {formData} = get();
            const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData, {
                withCredentials: true, // 🔥 very important
              });
            set({currentProduct: response.data.data, error: null});
            toast.success("Product updated successfully!")
        } catch (error) {
            set({error: "An error has occured. Please try again later", currentProduct: null});
        }finally{
            set({loading: false})
        }
    },
    addToCart: async (e) => {
        e.preventDefault();
        set({ loading: true });
      
        try {
          const { cartData } = get();
      
          await axios.post(
            `${BASE_URL}/api/products/add-to-cart`,
            {
              product_id: cartData.product_id,
              quantity: parseInt(cartData.quantity) || 1,
            },
            { withCredentials: true }
          );
      
          toast.success("Added to cart successfully!");
      
          set({ cartData: { product_id: "", quantity: "" } });
      
          // ✅ Fetch fresh cart data from DB
          await get().fetchUserCart(); 
      
        } catch (error) {
          const errorMessage =
            error?.response?.data?.message || "Failed to add to cart. Try again.";
          toast.error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },
      
    
    fetchUserCart: async () => {
        set({loading: true});
        try {
            const response = await axios.get(`${BASE_URL}/api/products/mycart`, {
                withCredentials: true,
                })
            set({cart : response.data.data, error: null});
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || "Failed to fetch user cart";
            set({error: errorMessage, cart: []});
        }finally {
            set({loading: false})
        }
    },
    deleteUserCart: async (cart_id) => {
        set({ loading: true });
        try {
            
            const response = await axios.delete(`${BASE_URL}/api/products/mycart/${cart_id}`, {
                withCredentials: true,
            });
            get().fetchUserCart();
            if (response.data.success) {
                
                set(prev => ({
                    cart: prev.cart.filter(item => item.cart_id === cart_id)
                }));
                
                toast.success("Item removed from cart");
            } else {
                throw new Error(response.data.message || "Failed to delete item");
            }
        } catch (error) {
            console.error("Error deleting cart item:", error);
            if (error.response?.status === 404) {
                toast.error("Item not found in your cart");
                // Optional: Refresh cart to sync with server
            } else {
                toast.error(error.response?.data?.message || "Failed to remove item");
            }
        } finally {
            set({ loading: false });
        }
    },
    clearCart: () => set({ cart: [] }),
    updateCartQuantity: async (cart_id, quantity) => {
        set({loading: true});
        try {
            const response = await axios.put(
                `${BASE_URL}/api/products/mycart/${cart_id}`, 
                { quantity },
                { withCredentials: true }
            );
            
            if (response.data.success) {
                // Update the cart item quantity locally to avoid a full refetch
                set(state => ({
                    cart: state.cart.map(item => 
                        item.cart_id === cart_id 
                        ? { ...item, quantity } 
                        : item
                    )
                }));
                
                // Optionally, you could do a full refetch instead
                // await get().fetchUserCart();
                
                toast.success("Cart updated");
            }
        } catch (error) {
            console.error("Error updating cart quantity:", error);
            toast.error(error.response?.data?.message || "Failed to update cart quantity");
        } finally {
            set({loading: false});
        }
    },
}
));