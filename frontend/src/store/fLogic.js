import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : ""
export const fLogic = create((set, get) => ({
    email: "",
    password: "",
    loading: false,

    setEmail: (email) => set({ email }),
    setPassword: (password) => set({ password }),
    setLoading: (loading) => set({ loading }),

    handleSignIn: async () => {
        const { email, password } = get(); // ✅ proper destructuring

        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        set({ loading: true });

        try {
            const { data } = await axios.post(`${BASE_URL}/api/signin`, { email, password });

            if (data.success) {
                toast.success("Login successful");
                console.log("Login successful");
                window.location.href = "/home"; // redirect on success
            } else {
                toast.error(data.error || "Login failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "An error occurred");
        } finally {
            set({ loading: false });
        }
    },
}));
