import { useProductStore } from '@/store/useProductStore'
import React, { useEffect } from 'react'

function CartPage() {
  const {cart, loading, error, fetchUserCart} = useProductStore();
  useEffect(() => {
    fetchUserCart();
  }, [fetchUserCart])
  return (
    <main className="mx-auto px-4 py-8 max-w-6xl">
    {cart.length === 0 && !loading? (
        <div>Oh shit its empty</div>
      ):(
        <div>
          {cart.map((item) => {
            return (
              <div key={item.cart_id}>
                {item.productName}
                <br />
                {item.productPrice}
              </div>

            )
          })}
        </div>
      )}
    </main>
  )
}

export default CartPage
