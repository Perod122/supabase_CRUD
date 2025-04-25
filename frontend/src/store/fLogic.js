import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : ""
export const fLogic = create((set, get) => ({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    email: "",
    password: "",
    loading: false,
    user: null,
    creds: null,

    setCreds: (creds) => set({ creds }),
    setFirstName: (firstName) => set({ firstName }),
    setLastName: (lastName) => set({ lastName }),
    setPhone: (phone) => set({ phone }),
    setGender: (gender) => set({ gender}),
    setUser: (userData) => set({user: userData}),
    setEmail: (email) => set({ email }),
    setPassword: (password) => set({ password }),
    setLoading: (loading) => set({ loading }),
   
    fetchUser: async () => {
        try {
          const { data } = await axios.get(`${BASE_URL}/api/session`, {
            withCredentials: true,
          });
      
          if (data.success) {
            set({ user: data.profile }); // Store the whole user object
            set({ creds: data.creds }); // Store the credentials if needed to get the email
          } else {
            console.warn("Session check failed:", data.message);
          }
        } catch (err) {
          console.error("Error fetching user session:", err.response?.data?.message || err.message);
        }
      }
      ,
    handleSignIn: async () => {
        const { email, password } = get(); // ✅ proper destructuring

        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        set({ loading: true });

        try {
            const { data } = await axios.post(`${BASE_URL}/api/signin`, { email, password }, {
                withCredentials: true,
              });
              

            if (data.success) {
                await get().fetchUser();
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
    handleSignUp: async () => {
        const {firstName, lastName, phone, gender, email, password} = get();

        if(!email || !password || !firstName || !lastName || !phone){
            toast.error("Please input all fields");
            return;
        }

        set({loading: true});

        try {
            const { data } = await axios.post(`${BASE_URL}/api/signup`, { firstName, lastName, phone, gender, email, password }, {
              withCredentials: true,
            });
            if (data.success) {
                toast.success("Signup successful");
                await get().fetchUser();
                window.location.href = "/home"; // redirect on success
            } else {
                toast.error(data.error || "Signup failed");
            }
            
        } catch (error) {
            toast.error(error.response?.data?.error || "An error occurred");
        }finally {
            set({ loading: false });
        }
    },
    handleSignOut: async () => {
      set({loading: true});
        try {
          await axios.post(`${BASE_URL}/api/signout`, {}, { withCredentials: true });
          set({user:null})
          set({creds:null})
          window.location.href = "/"; // redirect on success
        } catch (err) {
          toast.error("Error logging out");
        }finally {
          set({ loading: false });
      }
      }
}
));
