import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "";

export const useOrderStore = create((set) => ({
  loading: false,
  error: null,
  order: null,
  UserOrder: [],
  AllOrder: [],

  setCart: (cart) => set({ cart }),
  clearOrder: () => set({ order: null, error: null }),
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
  getUserOrders: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get(`${BASE_URL}/api/products/myorders`, { withCredentials: true });
      if (data.success) {
        set({ UserOrder: data.data });
      }else {
        throw new Error(data.message || "Failed to fetch orders");
      }

    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      return null;
    } finally {
      set({ loading: false });
    }
  },
  getAllOrders: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get(`${BASE_URL}/api/products/orders`, { withCredentials: true });
      if (data.success) {
        set({ AllOrder: data.orders });
      }else {
        throw new Error(data.message || "Failed to fetch orders");
      }

    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      return null;
    } finally {
      set({ loading: false });
    }
  },
  clearOrder: () => set({ order: null, error: null }),  
}));