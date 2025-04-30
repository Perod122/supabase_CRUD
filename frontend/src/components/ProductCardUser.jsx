import { ShoppingBag, ShoppingCartIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductStore } from "@/store/useProductStore";

function ProductCardUser({ product }) {
    const setCartData = useProductStore((state) => state.setCartData);
    const fetchUserCart = useProductStore((state) => state.fetchUserCart);
    const addToCart = useProductStore((state) => state.addToCart);

    const handleAddToCart = (e) => {
        e.preventDefault(); // prevents navigation if inside <Link>
        setCartData({
            product_id: product.id,  // ensure correct key
            quantity: 1,             // default quantity
        });
        addToCart(e);
        fetchUserCart();
    };

    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <figure className="relative pt-[56.25%]">
                <img
                    src={product.productImage}
                    alt={product.name}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
            </figure>

            <div className="card-body">
                <h2 className="card-title text-lg font-semibold">{product.productName}</h2>
                <p className="text-2xl font-bold">
                    ₱{Number(product.productPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </p>
                <div className="card-actions justify-between mt-4">
                    <button
                        onClick={handleAddToCart}
                        className="btn btn-sm btn-info btn-outline"
                    >
                        <ShoppingCartIcon className="size-4" />
                        Add to cart
                    </button>
                    <Link to="" className="btn btn-sm btn-success btn-outline">
                        <ShoppingBag className="size-4" />
                        Buy now
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ProductCardUser;
