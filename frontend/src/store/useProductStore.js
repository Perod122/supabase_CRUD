import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "";
export const useProductStore = create((set, get) => ({
    products: [],
    loading: false,
    error: null,
    currentProduct: null,

    formData : {
        productName: "",
        productPrice: "",
        productImage: "",
    },

    setFormData: (formData) => set ({formData}),
    resetForm: () => set({formData: {productName: "", productPrice: "", productImage: ""}}),

    addProduct: async (e) => {
        e.preventDefault();
        set({loading: true});
        try {
            const {formData} = get();
            await axios.post(`${BASE_URL}/api/products/create`, formData, {
                withCredentials: true, // 🔥 very important
              });
            await get().fetchProducts();
            get().resetForm()
            toast.success("Product Added Successfully");
            document.getElementById("add-product-modal").close();
        } catch (error) {
            toast.error("Something went wrong. Please try again later.");
        }finally{
            set({loading: false})
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
    }
}
));