import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'

export const calcTotal = (arr) => {
  let total = 0
  arr.forEach((item) => {
    total += item.price
  })
  total = total.toFixed(2) // only use 2 decimal places

  return total
}

// accepts an item id
export const removeFromCart = (id) => {
  const storedCart = JSON.parse(localStorage.getItem("cart"));
  const newCart = storedCart.filter((item) => item.id !== id);

  // save the new cart
  localStorage.setItem("cart", JSON.stringify(newCart))

  return newCart
}

export const removeAllFromCart = () => {
  localStorage.removeItem("cart")
}

export default function Cart() {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // load the cart from local storage and calc total
    if (localStorage.getItem("cart") != null) {
      const storedCart = JSON.parse(localStorage.getItem("cart"))
      setCart(storedCart)

      setTotal(calcTotal(storedCart))
    }
  }, [])

  const clearCart = () => {
    removeAllFromCart()
    setCart([])
    setTotal(0)
    toast.success("Cart Cleared!")
  }

  const removeItem = (id) => {
    const newCart = removeFromCart(id)
    setCart(newCart)
    setTotal(calcTotal(newCart))
    toast.success("Item removed from cart")
  }

  return (
    <>
      <div className="bg-gray-100 p-4 flex flex-row items-center sticky top-0">
        <h1 className="text-3xl">Cart</h1>
        <div className="" title="Clear Cart" onClick={clearCart}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div className='flex flex-col ml-auto text-lg'>
          <span>{cart.length} item(s)</span>
          <span>Total: ${total}</span>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 mt-4 mx-4 h-full pb-4 overflow-auto">
        {cart.map((item) => (
          <div key={item.id} className="bg-orange-200 p-4 flex flex-row items-center">
            <div className="pr-2">
              {item.title} &middot; {item.size.substring(0, 1).toUpperCase() + item.size.slice(1)} &middot; ${item.price}
            </div>
            <div className="ml-auto">
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold text-lg  px-2 rounded" onClick={() => removeItem(item.id, cart)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        {/* if cart is empty display a text saying so */}
        {cart.length === 0 && (
          <div className="bg-orange-200 p-4 flex flex-row items-center">
            <div className="pr-2">
              Your cart is empty, add some items!
            </div>
          </div>
        )}
      </div>
      {cart.length > 0 && (
        <div className="sticky bottom-16 w-full max-w-screen-md pb-2 px-4">
          <Link href="/cart/checkout">
            <button className="bg-red-500 text-white text-lg rounded-lg p-4 w-full">Schedule Pickup</button>
          </Link>
        </div>
      )}
    </>
  )
}


