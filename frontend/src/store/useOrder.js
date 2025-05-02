import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "";

export const useOrderStore = create((set) => ({
  loading: false,
  error: null,
  order: null,

  placeOrder: async ({ cart, paymentMethod, deliveryAddress }) => {
    try {
      set({ loading: true, error: null, order: null });
      
      const { data } = await axios.post(
        `${BASE_URL}/api/products/orders/place`,
        { cart, paymentMethod, deliveryAddress },
        { withCredentials: true }
      );

      if (data.success) {
        set({ order: data.order });
        return data.order;
      }
      throw new Error(data.message || "Order failed");
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      toast.error(error.response?.data?.message || "Failed to place order");
      return null;
    } finally {
      set({ loading: false });
    }
  },
  clearOrder: () => set({ order: null, error: null })
}));