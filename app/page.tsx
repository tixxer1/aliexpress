"use client"

import { useState } from "react"
import {
  Heart,
  Search,
  ShoppingCart,
  Menu,
  User,
  ChevronRight,
  Truck,
  Package,
  Shield,
  X,
  Plus,
  Minus,
} from "lucide-react"

interface Product {
  id: number
  title: string
  price: number
  originalPrice?: number
  image: string
  sold: number
  discount?: string
  shipping: number
  deliveryDate: string
  likes: number
}

interface CartItem extends Product {
  quantity: number
}

const products: Product[] = [
  {
    id: 1,
    title: "BITMAIN Z15 pro 840k/sol 2780w",
    price: 3499,
    image: "/images/image.png",
    sold: 1,
    discount: "$3.00 off on $23.00",
    shipping: 47.16,
    deliveryDate: "7 days",
    likes: 0,
  },
  {
    id: 2,
    title: "Smart Watch Series 8 GPS 45mm Aluminum Case with Sport Band",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://zerolifestyle.co/cdn/shop/files/ad07withouttext.webp?v=1736171250&width=300",
    sold: 245,
    discount: "$50.00 off",
    shipping: 12.5,
    deliveryDate: "14 days",
    likes: 12,
  },
  {
    id: 3,
    title: "Wireless Bluetooth Headphones Over Ear with Noise Cancelling",
    price: 45.99,
    image: "/bluetooth-headphones.png",
    sold: 1523,
    shipping: 5.99,
    deliveryDate: "21 days",
    likes: 89,
  },
  {
    id: 4,
    title: "RGB LED Strip Lights 50ft with Remote Control App Controlled",
    price: 24.99,
    originalPrice: 39.99,
    image: "https://img.drz.lazcdn.com/static/pk/p/b8f32bd911981989c004d4f213b5937e.jpg_200x200q80.avif",
    sold: 3421,
    discount: "$15.00 off",
    shipping: 3.99,
    deliveryDate: "28 days",
    likes: 234,
  },
  {
    id: 5,
    title: "Fast USB C Charger 65W PD Multi-Port Wall Adapter",
    price: 18.99,
    image: "https://img.drz.lazcdn.com/static/pk/p/005728ac7440e9cf2b097f58f4c43398.jpg_200x200q80.avif",
    sold: 892,
    shipping: 2.5,
    deliveryDate: "35 days",
    likes: 45,
  },
  {
    id: 6,
    title: "Mechanical Gaming Keyboard RGB Backlit 104 Keys Wired USB",
    price: 67.99,
    originalPrice: 89.99,
    image: "/gaming-keyboard.png",
    sold: 567,
    discount: "$22.00 off",
    shipping: 8.99,
    deliveryDate: "42 days",
    likes: 156,
  },
]

export default function Home() {
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set())
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [selectedQuantities, setSelectedQuantities] = useState<Record<number, number>>({})

  const toggleLike = (id: number) => {
    setLikedProducts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const getQuantity = (productId: number) => {
    return selectedQuantities[productId] || 1
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity >= 1 && quantity <= 100) {
      setSelectedQuantities((prev) => ({
        ...prev,
        [productId]: quantity,
      }))
    }
  }

  const incrementQuantity = (productId: number) => {
    const current = getQuantity(productId)
    if (current < 100) {
      updateQuantity(productId, current + 1)
    }
  }

  const decrementQuantity = (productId: number) => {
    const current = getQuantity(productId)
    if (current > 1) {
      updateQuantity(productId, current - 1)
    }
  }

  const addToCart = (product: Product) => {
    const quantity = getQuantity(product.id)
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
      }
      return [...prevCart, { ...product, quantity }]
    })
    setSelectedQuantities((prev) => ({
      ...prev,
      [product.id]: 1,
    }))
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity >= 1 && quantity <= 100) {
      setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = () => {
    // Save cart to localStorage for checkout page
    localStorage.setItem("checkout_cart", JSON.stringify(cart))
    // Navigate to checkout page
    window.location.href = "/checkout"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <button className="lg:hidden">
                <Menu className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Alibaba</h1>
              </div>

              <div className="flex-1 max-w-3xl mx-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="smart watch, headphones, led lights..."
                    className="w-full px-4 py-2.5 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-1.5 rounded-md font-medium transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <button className="hidden lg:flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <User className="w-6 h-6" />
                  <span className="text-sm">Sign In</span>
                </button>
                <button onClick={() => setShowCart(true)} className="relative hover:opacity-80 transition-opacity">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4">
            <nav className="flex gap-8 py-3 overflow-x-auto">
              <a
                href="#"
                className="text-sm text-gray-700 hover:text-orange-500 whitespace-nowrap font-medium transition-colors"
              >
                Electronics
              </a>
              <a
                href="#"
                className="text-sm text-gray-700 hover:text-orange-500 whitespace-nowrap font-medium transition-colors"
              >
                Fashion
              </a>
              <a
                href="#"
                className="text-sm text-gray-700 hover:text-orange-500 whitespace-nowrap font-medium transition-colors"
              >
                Home & Garden
              </a>
              <a
                href="#"
                className="text-sm text-gray-700 hover:text-orange-500 whitespace-nowrap font-medium transition-colors"
              >
                Sports
              </a>
              <a
                href="#"
                className="text-sm text-gray-700 hover:text-orange-500 whitespace-nowrap font-medium transition-colors"
              >
                Toys & Hobbies
              </a>
              <a
                href="#"
                className="text-sm text-gray-700 hover:text-orange-500 whitespace-nowrap font-medium transition-colors"
              >
                Beauty & Health
              </a>
              <a
                href="#"
                className="text-sm text-gray-700 hover:text-orange-500 whitespace-nowrap font-medium transition-colors"
              >
                Automotive
              </a>
            </nav>
          </div>
        </div>
      </header>

      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end">
          <div className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col">
            {/* Cart Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart ({cartItemsCount})</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingCart className="w-16 h-16 mb-4" />
                  <p className="text-lg">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-20 h-20 object-contain bg-white rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm text-gray-800 line-clamp-2 mb-2">{item.title}</h3>
                        <p className="text-lg font-bold text-gray-900 mb-2">${item.price}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = Number.parseInt(e.target.value) || 1
                                updateCartQuantity(item.id, val)
                              }}
                              min="1"
                              max="100"
                              className="w-12 text-center border border-gray-300 rounded py-1 text-sm"
                            />
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= 100}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 text-sm hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-contain p-4"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">1/1</div>
                <button
                  onClick={() => toggleLike(product.id)}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
                >
                  <Heart
                    className={`w-5 h-5 ${likedProducts.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                  />
                </button>
                <div className="absolute bottom-2 right-2 flex items-center gap-1 text-gray-600">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{product.likes + (likedProducts.has(product.id) ? 1 : 0)}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="text-sm text-gray-800 line-clamp-2 mb-2 leading-snug">{product.title}</h3>

                <p className="text-xs text-gray-500 mb-3">{product.sold} sold</p>

                <div className="mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Tax excluded, add at checkout if applicable</p>
                </div>

                {product.discount && (
                  <div className="mb-3 bg-red-50 border border-red-200 rounded p-2 flex items-center justify-between">
                    <span className="text-xs text-red-600 font-medium">{product.discount}</span>
                    <ChevronRight className="w-4 h-4 text-red-600" />
                  </div>
                )}

                {/* Service Commitment */}
                <div className="border-t pt-3 mt-auto">
                  <h4 className="text-xs font-semibold text-green-600 mb-2">Service commitment</h4>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Shipping: ${product.shipping}</p>
                          <p className="text-gray-500">Delivery: {product.deliveryDate}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between text-xs py-2 border-t">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">Free returns within 90 days</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between text-xs py-2 border-t">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">Security & Privacy</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-3">
                  <label className="text-xs text-gray-600 mb-1 block">Quantity:</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrementQuantity(product.id)}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={getQuantity(product.id)}
                      onChange={(e) => {
                        const val = Number.parseInt(e.target.value) || 1
                        updateQuantity(product.id, val)
                      }}
                      min="1"
                      max="100"
                      className="w-16 text-center border border-gray-300 rounded py-2 font-medium"
                    />
                    <button
                      onClick={() => incrementQuantity(product.id)}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-gray-500 ml-1">Max: 100</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 font-semibold py-3 rounded-lg transition-all transform hover:scale-105"
                  >
                    Add to cart
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105">
                    Buy now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Report Abuse
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Open Dispute
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Shopping</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Payment Methods
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Buyer Protection
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Shipping
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Collaborate</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Partnerships
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Affiliate Program
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Stay Connected</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Social Media
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2025 Alibaba Clone | Created by rafay sheikh</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
