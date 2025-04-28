import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : ""

export const fLogic = create((set, get) => ({
  // States
  firstName: "",
  lastName: "",
  phone: "",
  gender: "",
  email: "",
  password: "",
  loading: false,
  user: null,
  creds: null,
  form: { firstname: "", lastname: "", phone: "", gender: "" }, // NEW form state

  // Setters
  setCreds: (creds) => set({ creds }),
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setPhone: (phone) => set({ phone }),
  setGender: (gender) => set({ gender }),
  setUser: (userData) => set({ user: userData }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setLoading: (loading) => set({ loading }),

  // Fetch current session user
  fetchUser: async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/products/session`, {
        withCredentials: true,
      });

      if (data.success) {
        set({ user: data.profile });
        set({ creds: data.creds });
        set({ 
          form: { 
            firstname: data.profile.firstname || '',
            lastname: data.profile.lastname || '',
            phone: data.profile.phone || '',
            gender: data.profile.gender || ''
          } 
        });
      } else {
        console.warn("Session check failed:", data.message);
      }
    } catch (err) {
      console.error("Error fetching user session:", err.response?.data?.message || err.message);
    }
  },

  // Form handlers
  handleFormChange: (e) => {
    const { name, value } = e.target;
    set((state) => ({
      form: { ...state.form, [name]: value }
    }));
  },

  updateProfile: async () => {
    set({ loading: true });
    try {
      const { form } = get();
  
      const { data } = await axios.put(`${BASE_URL}/api/products/profile`, form, {
        withCredentials: true,
      });
  
      if (data.success) {
        toast.success("Profile updated successfully!");
        // No need for await get().fetchUser(); here, just call fetchUser() once at the end
        await get().fetchUser(); // Refetch the latest user data
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update profile");
      console.error("Error updating profile:", err.response?.data?.error || err.message);
    } finally {
      set({ loading: false });
    }
  },
  

  // Authentication
  handleSignIn: async () => {
    const { email, password } = get();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    set({ loading: true });

    try {
      const { data } = await axios.post(`${BASE_URL}/api/products/signin`, { email, password }, {
        withCredentials: true,
      });

      if (data.success) {
        await get().fetchUser();
        window.location.href = "/home";
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  handleSignUp: async () => {
    const { firstName, lastName, phone, gender, email, password } = get();

    if (!email || !password || !firstName || !lastName || !phone) {
      toast.error("Please input all fields");
      return;
    }

    set({ loading: true });

    try {
      const { data } = await axios.post(`${BASE_URL}/api/products/signup`, { firstName, lastName, phone, gender, email, password }, {
        withCredentials: true,
      });

      if (data.success) {
        toast.success("Signup successful");
        await get().fetchUser();
        window.location.href = "/home";
      } else {
        toast.error(data.error || "Signup failed");
      }

    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  handleSignOut: async () => {
    set({ loading: true });
    try {
      await axios.post(`${BASE_URL}/api/products/signout`, {}, { withCredentials: true });
      set({ user: null });
      set({ creds: null });
      window.location.href = "/";
    } catch (err) {
      toast.error("Error logging out");
    } finally {
      set({ loading: false });
    }
  }
}));
