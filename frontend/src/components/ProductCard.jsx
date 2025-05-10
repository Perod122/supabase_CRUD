import { EditIcon, Trash2Icon, BoxIcon } from "lucide-react";
import { Link } from "react-router-dom";
import DeleteConfirmationDialog from "./DeleteDialog";
import { useProductStore } from "@/store/useProductStore";

function ProductCard({ product }) {
    const {deleteProduct} = useProductStore();
    
    // Determine stock status
    const isLowStock = product.stocks <= 5;
    const isOutOfStock = product.stocks <= 0;
    
    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <figure className="relative pt-[56.25%]">
                <img src={product.productImage} alt={product.name} className="absolute top-0 left-0 w-full h-full object-cover" />
                {isOutOfStock && (
                    <div className="absolute top-0 right-0 bg-error text-error-content px-2 py-1 text-xs font-semibold">
                        OUT OF STOCK
                    </div>
                )}
            </figure>

            <div className="card-body">
                <h2 className="card-title text-lg font-semibold">{product.productName}</h2>
                <p className="text-2xl font-bold text-primary">
                    ₱{Number(product.productPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                
                <div className="flex items-center mt-1">
                    <BoxIcon className="size-4 mr-1" />
                    <span className={`text-sm ${isLowStock ? 'text-warning font-semibold' : ''} ${isOutOfStock ? 'text-error font-semibold' : ''}`}>
                        Stock: {product.stocks || 0}
                        {isLowStock && !isOutOfStock && " (Low)"}
                    </span>
                </div>
                
                <div className="card-actions justify-end mt-4">
                    <Link to={`/product/${product.id}`} className="btn btn-sm btn-info btn-outline">
                        <EditIcon className="size-4" />
                    </Link>

                    <DeleteConfirmationDialog
                        onConfirm={() => deleteProduct(product.id)}
                        trigger={
                        <button className="btn btn-sm btn-error btn-outline">
                        <Trash2Icon className="size-4" />
                    </button>
                        }
                     />
                </div>
            </div>
        </div>
    );
}

export default ProductCard;