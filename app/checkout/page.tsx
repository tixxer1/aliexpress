"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Copy, Check, Package, Clock, Bitcoin, MapPin, User, Mail, Phone } from "lucide-react"

interface CartItem {
  id: number
  title: string
  price: number
  image: string
  quantity: number
  shipping: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [copied, setCopied] = useState(false)
  const [shippingCopied, setShippingCopied] = useState(false)
  const [btcPrice, setBtcPrice] = useState(0)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  const shippingInfo = {
    name: "guan zhuang",
    address: "8 St. Andrews Road, Greater Manchester, England, United Kingdom, SK83ES",
    zipCode: "SK83ES",
    email: "guanno1@yahoo.com",
    phone: "+44 07984664387",
  }

  const BTC_ADDRESS = "bc1qpw3h3ray33m34f5zcxgsu9r7jdq497aev3vn29"

  useEffect(() => {
    // Get cart from localStorage or sessionStorage
    const savedCart = localStorage.getItem("checkout_cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    // Fetch BTC price (using a mock value, in production use a real API)
    // Example: CoinGecko API - https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd
    fetchBTCPrice()
  }, [])

  const fetchBTCPrice = async () => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
      const data = await response.json()
      setBtcPrice(data.bitcoin.usd)
    } catch (error) {
      console.error("Error fetching BTC price:", error)
      // Fallback price in USD
      setBtcPrice(100000)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingTotal = cartItems.reduce((sum, item) => sum + item.shipping * item.quantity, 0)
  const total = subtotal + shippingTotal
  const btcAmount = btcPrice > 0 ? (total / btcPrice).toFixed(8) : "0.00000000"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(BTC_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyShippingInfo = () => {
    const fullInfo = `Receiver Name: ${shippingInfo.name}
Detailed address: ${shippingInfo.address}
Zip Code: ${shippingInfo.zipCode}
Email: ${shippingInfo.email}
Phone: ${shippingInfo.phone}`

    navigator.clipboard.writeText(fullInfo)
    setShippingCopied(true)
    setTimeout(() => setShippingCopied(false), 2000)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No items to checkout</h2>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push("/")} className="hover:opacity-80 transition-opacity">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold">Checkout</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm text-gray-800 line-clamp-2 mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500 mb-2">Qty: {item.quantity}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">${item.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-600">Total: ${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium text-gray-900">${shippingTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span className="text-orange-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipment Information</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Receiver Name</p>
                    <p className="font-semibold text-gray-900">{shippingInfo.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Detailed address</p>
                    <p className="font-semibold text-gray-900 leading-relaxed">{shippingInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Zip Code</p>
                    <p className="font-semibold text-gray-900">{shippingInfo.zipCode}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-semibold text-gray-900">{shippingInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-semibold text-gray-900">{shippingInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Tax Number</p>
                    <p className="text-gray-400 italic text-sm">Not provided</p>
                  </div>
                </div>
              </div>

              <button
                onClick={copyShippingInfo}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {shippingCopied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Bitcoin className="w-7 h-7 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Bitcoin Payment</h2>
                  <p className="text-sm text-gray-500">Pay securely with cryptocurrency</p>
                </div>
              </div>

              {/* BTC Amount */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">Amount to pay:</p>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-4xl font-bold text-gray-900">{btcAmount}</span>
                  <span className="text-xl font-semibold text-orange-600">BTC</span>
                </div>
                <p className="text-xs text-gray-500">
                  ≈ ${total.toFixed(2)} USD at current rate (1 BTC = ${btcPrice.toLocaleString()})
                </p>
              </div>

              {/* QR Code */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6 flex flex-col items-center">
                <p className="text-sm text-gray-600 mb-4 text-center">Scan QR code with your wallet</p>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bitcoin:${BTC_ADDRESS}?amount=${btcAmount}`}
                    alt="Bitcoin QR Code"
                    className="w-48 h-48"
                  />
                </div>
              </div>

              {/* Bitcoin Address */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Bitcoin Address:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={BTC_ADDRESS}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span className="hidden sm:inline">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Payment Instructions:</h3>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Send exactly {btcAmount} BTC to the address above</li>
                      <li>Payment confirmation typically takes 10-30 minutes</li>
                      <li>You will receive an email confirmation once payment is verified</li>
                      <li>Do not close this page until payment is confirmed</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Confirm Payment Button */}
              {paymentConfirmed ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <Check className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-green-900 mb-2">Payment Confirmed!</h3>
                  <p className="text-sm text-green-700 mb-4">
                    Your order has been placed successfully. You will receive a confirmation email shortly.
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setPaymentConfirmed(true)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  I have sent the payment
                </button>
              )}

              <p className="text-xs text-center text-gray-500 mt-4">
                Note: In a production environment, payment verification would be automated via blockchain monitoring.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
