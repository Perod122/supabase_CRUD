import { BadgeDollarSignIcon, CircleDollarSignIcon, DollarSign, DollarSignIcon, ImageIcon, PackageIcon, PlusCircleIcon, BoxIcon } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import { useState } from "react";

function AddProductModal() {
  const { addProduct, formData, setFormData, loading } = useProductStore();
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData({ ...formData, productImage: file });
    }
  };

  return (
    <dialog id="add-product-modal" className="modal">
      <div className="modal-box">
        {/* CLOSE BUTTON (top-right) */}
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => document.getElementById("add-product-modal")?.close()}
        >
          X
        </button>
        {/* MAIN SUBMISSION FORM */}
        <form onSubmit={addProduct} className="space-y-6">
          <div className="grid gap-6">
            {/* Product Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text mb-2 text-base font-medium">Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <PackageIcon className="size-5" />
                </div>
                <input
                  type="text"
                  placeholder="Product name"
                  className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Product Price */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Price</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <CircleDollarSignIcon className="size-5" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Product price"
                  className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
                  value={formData.productPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, productPrice: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Product Stock */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Stock Quantity</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <BoxIcon className="size-5" />
                </div>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Stock quantity"
                  className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
                  value={formData.stocks}
                  onChange={(e) =>
                    setFormData({ ...formData, stocks: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
            </div>

            {/* Product Image Upload */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Image</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <ImageIcon className="size-5" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
                  onChange={handleImageChange}
                />
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="modal-action">
            {/* Cancel button (just closes the modal) */}
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                document.getElementById("add-product-modal")?.close();
                setImagePreview(null);
              }}
            >
              Cancel
            </button>

            {/* Submit button */}
            <button
              type="submit"
              className="btn btn-primary min-w-[120px]"
              disabled={
                !formData.productName ||
                !formData.productPrice ||
                !formData.productImage ||
                loading
              }
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <PlusCircleIcon className="size-5 mr-2" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* MODAL BACKDROP */}
      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  );
}

export default AddProductModal;
