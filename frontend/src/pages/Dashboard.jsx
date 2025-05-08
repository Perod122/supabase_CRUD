import React, { useEffect } from 'react';
import { useProductStore } from '../store/useProductStore';
import { PackageIcon, PlusCircleIcon, RefreshCwIcon } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import AddProductModal from '../components/AddProductModal';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants for the container
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Animation variants for individual items
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function Dashboard() {
  const { products, loading, error, fetchProducts } = useProductStore();
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <main className="mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-primary" 
          onClick={() => document.getElementById("add-product-modal").showModal()}
        >
          <PlusCircleIcon className="size-5 mr-2" />
          Add Product
        </motion.button>
        <motion.button 
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
          className="btn btn-ghost btn-circle" 
          onClick={fetchProducts}
        >
          <RefreshCwIcon className="size-5" />
        </motion.button>
      </div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert alert-error mb-8"
        >
          {error}
        </motion.div>
      )}

      {products.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center h-96 space-y-4"
        >
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="bg-base-100 rounded-full p-6"
          >
            <PackageIcon className="size-12" />
          </motion.div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold">No products found.</h3>
            <p className="text-gray-500 max-w-sm">
              Click the button above to add a new product.
            </p>
          </div>
        </motion.div>
      )}
      
      <AddProductModal />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"/>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map(product => (
              <motion.div
                key={product.id}
                variants={item}
                layout
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </main>
  );
}

export default Dashboard;
