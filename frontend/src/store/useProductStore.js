import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "";
export const useProductStore = create((set, get) => ({
    products: [],
    loading: false,
    error: null,
    currentProduct: null,

    FormData : {
        name: "",
        price: "",
        image: "",
    },

    setFormData: (FormData) => set ({FormData}),
    resetForm: () => set({formData: {name: "", price: "", image: ""}}),

    addProduct: async (e) => {
        e.prevenDefault();
        set({loading: true});
        try {
            const {formData} = get();
            await axios.post(`${BASE_URL}/api/create`, formData);
            await get().fetchProducts();
            get().resetForm
            toast.success("Prodcut Added Successfully");
        } catch (error) {
            toast.error("Something went wrong. Please try again later.");
        }finally{
            set({loading: false})
        }
    },
    fetchProducts: async () => {
        set({loading: true})

        try {
            const response = await axios.get(`${BASE_URL}/api/products`);
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
    }
}
));