import { ShoppingBag, ShoppingCartIcon, BoxIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProductStore } from "@/store/useProductStore";
import { useOrderStore } from "@/store/useOrder";
import { useState } from "react";
import { toast } from "react-hot-toast";

function ProductCardUser({ product }) {
    const navigate = useNavigate();
    const [isBuying, setIsBuying] = useState(false);
    const setCartData = useProductStore((state) => state.setCartData);
    const fetchUserCart = useProductStore((state) => state.fetchUserCart);
    const addToCart = useProductStore((state) => state.addToCart);
    const placeOrder = useOrderStore((state) => state.placeOrder);
    const setBuyNow = useOrderStore((state) => state.setBuyNow);

    // Determine stock status
    const isLowStock = product.stocks <= 5;
    const isOutOfStock = product.stocks <= 0;

    const handleAddToCart = (e) => {
        e.preventDefault(); // prevents navigation if inside <Link>
        
        if (isOutOfStock) {
            toast.error("This product is out of stock");
            return;
        }
        
        setCartData({
            product_id: product.id,  // ensure correct key
            quantity: 1,             // default quantity
        });
        addToCart(e);
        fetchUserCart();
    };

    const handleBuyNow = async (e) => {
        e.preventDefault();
        
        if (isOutOfStock) {
            toast.error("This product is out of stock");
            return;
        }
        
        try {
            setIsBuying(true);
            
            // Create a cart-like item structure with just this product
            const singleItemCart = [{
                id: product.id,
                productName: product.productName,
                productPrice: product.productPrice,
                productImage: product.productImage,
                quantity: 1
            }];

            // Navigate to checkout with the product data
            navigate('/checkout', { 
                state: { 
                    buyNow: true, 
                    items: singleItemCart,
                    total: product.productPrice
                }
            });
        } catch (error) {
            console.error("Buy now error:", error);
            toast.error("Failed to process your order. Please try again.");
        } finally {
            setIsBuying(false);
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <figure className="relative pt-[56.25%]">
                <img
                    src={product.productImage}
                    alt={product.name}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                {isOutOfStock && (
                    <div className="absolute top-0 right-0 bg-error text-error-content px-2 py-1 text-xs font-semibold">
                        OUT OF STOCK
                    </div>
                )}
            </figure>

            <div className="card-body">
                <h2 className="card-title text-lg font-semibold">{product.productName}</h2>
                <p className="text-2xl font-bold">
                    ₱{Number(product.productPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </p>
                
                <div className="flex items-center mt-1">
                    <BoxIcon className="size-4 mr-1" />
                    <span className={`text-sm ${isLowStock ? 'text-warning font-semibold' : ''} ${isOutOfStock ? 'text-error font-semibold' : ''}`}>
                        {isOutOfStock ? 'Out of stock' : isLowStock ? `Only ${product.stocks} left` : `Stock: ${product.stocks}`}
                    </span>
                </div>
                
                <div className="card-actions justify-between mt-4">
                    <button
                        onClick={handleAddToCart}
                        className={`btn btn-sm ${isOutOfStock ? 'btn-disabled' : 'btn-info'} btn-outline`}
                        disabled={isOutOfStock}
                    >
                        <ShoppingCartIcon className="size-4" />
                        Add to cart
                    </button>
                    <button 
                        onClick={handleBuyNow}
                        className={`btn btn-sm ${isOutOfStock ? 'btn-disabled' : 'btn-success'} btn-outline`}
                        disabled={isBuying || isOutOfStock}
                    >
                        <ShoppingBag className="size-4" />
                        {isBuying ? "Processing..." : "Buy now"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCardUser;
