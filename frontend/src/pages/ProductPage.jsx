import React, { useEffect } from 'react'
import { useProductStore } from '@/store/useProductStore'
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, Trash2Icon, SaveIcon, BoxIcon } from 'lucide-react';
import DeleteConfirmationDialog from '@/components/DeleteDialog';

function ProductPage() {
    const {
        currentProduct,
        formData,
        setFormData,
        loading,
        error,
        fetchProduct,
        updateProduct,
        deleteProduct} = useProductStore();

        const navigate = useNavigate();
        const {id} = useParams();

        useEffect(() => {
            fetchProduct(id);
        }, [fetchProduct, id])

        if(loading) {
            return(
                <div className="flex justify-center items-center min-h-screen">
                    <div className="loading loading-spinner loading-lg"/>
                </div>
            );
        }

        if(error){
            return (
                <div className="alert alert-error">
                    {error}
                </div>
            );
        }
    return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button className="btn btn-ghost mb-2" onClick={() => navigate(-1)}>
                <ArrowLeftIcon className="size-5 mr-2" />
                Go back
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-lg overflow-hidden max-h-auto shadow-lg bg-base-100">
                    <img src={currentProduct?.productImage} alt={currentProduct?.productNamename} className="size-full object-cover" />
                </div>
                {/* PRODUCT FORM */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-6">Edit Product</h2>

                        <form onSubmit={(e) => {e.preventDefault(); updateProduct(id);}} className="space-y-6">
                        
                        {/* PRODUCT NAME */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base font-medium">Product Name</span>
                            </label>
                                <input 
                                type="text" 
                                placeholder="Product name" 
                                className="input input-bordered w-full" 
                                value={formData.productName} 
                                onChange={(e) => setFormData({...formData, productName: e.target.value})}
                                />
                        </div>
                        {/* PRODUCT PRICE */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base font-medium">Price</span>
                            </label>
                            <input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            placeholder="Product price" 
                            className="input input-bordered w-full" 
                            value={formData.productPrice} 
                            onChange={(e) => setFormData({...formData, productPrice: e.target.value})}
                            />
                        </div>
                        {/* PRODUCT STOCKS */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base font-medium">Stock Quantity</span>
                            </label>
                            <div className="flex items-center">
                                <div className="relative flex-1">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/50">
                                        <BoxIcon className="size-5" />
                                    </span>
                                    <input 
                                        type="number" 
                                        min="0" 
                                        step="1" 
                                        placeholder="Available stock" 
                                        className="input input-bordered w-full pl-10" 
                                        value={formData.stocks || 0} 
                                        onChange={(e) => setFormData({...formData, stocks: parseInt(e.target.value) || 0})}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* PRODUCT IMAGE URL */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base font-medium">Image</span>
                            </label>
                            <input 
                            type="text" 
                            placeholder="https://example.com/image.jpg" 
                            className="input input-bordered w-full" 
                            value={formData.productImage} 
                            onChange={(e) => setFormData({...formData, productImage: e.target.value})}
                            />
                        </div>
                        {/* SUBMIT BUTTON */}
                        <div className="flex justify-end space-x-2 mt-8">
                        <DeleteConfirmationDialog
                        onConfirm={() => {
                            deleteProduct(id);
                            navigate('/home');
                        }}
                        trigger={
                        <button className="btn btn-primary btn-warning btn-outline">
                        <Trash2Icon className="size-4" />Delete
                    </button>
                        }
                     />
                            <button type="submit" className="btn btn-primary" disabled={loading || !formData.productName || !formData.productPrice || !formData.productImage}>
                                {loading ? (
                                    <div className="loading loading-spinner loading-sm"/>
                                ) : (
                                    <>
                                    <SaveIcon className="size-5 mr-2" />
                                    Save
                                    </>
                                )}
                            </button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default ProductPage
