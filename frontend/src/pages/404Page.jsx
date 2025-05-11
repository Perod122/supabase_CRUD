import React, { useEffect } from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { fLogic } from "../store/fLogic";

const PageNotFound = () => {
    const navigate = useNavigate();
    const authenticated = useAuth();
    const user = fLogic((state) => state.user);

    useEffect(() => {
        if (authenticated && user) {
            // Redirect based on user role after a short delay
            const timer = setTimeout(() => {
                if (user.role === "admin") {
                    navigate("/home");
                } else {
                    navigate("/user");
                }
            }, 2000); // 2-second delay before redirect
            return () => clearTimeout(timer);
        }
    }, [authenticated, user, navigate]);

    const handleNavigation = () => {
        if (authenticated && user) {
            if (user.role === "admin") {
                navigate("/home");
            } else {
                navigate("/user");
            }
        } else {
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="max-w-md w-full px-6 py-8 bg-base-content shadow-lg rounded-lg text-center">
                <h2 className="text-6xl font-bold text-primary mb-4">404</h2>
                <h3 className="text-2xl font-semibold text-primary mb-2">Page Not Found</h3>
                <p className="text-primary mb-8">
                    Oops! The page you're looking for doesn't exist.
                    {authenticated && user && (
                        <span className="block mt-2">
                            Redirecting you to your dashboard...
                        </span>
                    )}
                </p>
                <Button 
                    variant="default" 
                    size="lg" 
                    onClick={handleNavigation}
                    className="w-full max-w-xs mx-auto"
                >
                    {authenticated && user 
                        ? "Go to Dashboard" 
                        : "Back to Homepage"}
                </Button>
            </div>
        </div>
    );
};

export default PageNotFound;