import React, { useEffect } from 'react';
import { useProductStore } from '../store/useProductStore';
import {PackageIcon, RefreshCwIcon } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductCardUser from '@/components/ProductCardUser';
function UserPage() {
  const {products, loading, error, fetchProducts} = useProductStore();
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  //hello test
  return (
    <main className="mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <button className="btn btn-ghost btn-circle" onClick={fetchProducts}>
          <RefreshCwIcon className="size-5" />
        </button>
      </div>
      
      {error && <div className="alert alert-error mb-8">{error}</div>}

      {products.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <div className="bg-base-100 rounded-full p-6">
              <PackageIcon className="size-12" />
        </div>
        <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold">No products found.</h3>
        </div>
        </div>
      )}
      {loading ? (
          <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"/>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
            <ProductCardUser key={product.id} product={product} />  
            ))}
        </div>
      )}
    </main>
  );
}

export default UserPage;
