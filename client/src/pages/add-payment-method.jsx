import { useState } from "react"
import MasterCard from "../../public/logos_mastercard.svg"
import GooglePay from "../../public/logos_google-pay.svg"
import ApplePay from "../../public/logos_apple-pay.svg"
import { useNavigate } from "react-router-dom"

const AddPaymentMethod = () => {
    const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("mastercard")

  const redirectToCheckout = () => {
       navigate('/checkout');
  }

  return (
    <div className="lg:mt-[5%] sm:mt-[10%] min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md shadow-lg bg-[#FFFFFF] rounded-3xl p-4 sm:p-6 md:p-8">
        <h1 className="text-xl sm:text-2xl hero_h1 text-center font-semibold mb-1">Add Payment Method</h1>
        <p className="text-gray-500 text-center text-xs sm:text-sm px-4 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor modi
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { id: "mastercard", name: "Mastercard", logo: MasterCard },
            { id: "googlepay", name: "GooglePay", logo: GooglePay },
            { id: "applepay", name: "ApplePay", logo: ApplePay },
          ].map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`flex items-center justify-center p-2 cursor-pointer rounded-lg border transition-all ${
                selectedMethod === method.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={method.logo}
                alt={method.name}
                className="h-3 w-auto object-contain mr-2"
              />
              <span className="text-xs font-medium text-black">{method.name}</span>
            </button>
          ))}
        </div>

        <form className="space-y-3 sm:space-y-4">
          <div>
            <input
              type="text"
              placeholder="Card Number"
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-400/30 outline-none bg-[#E3E3E3] text-sm rounded-3xl"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Card holder name"
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-400/30 outline-none bg-[#E3E3E3] text-sm rounded-3xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Expiry date"
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-400/30 outline-none bg-[#E3E3E3] text-sm rounded-3xl"
            />
            <input
              type="text"
              placeholder="CVV"
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-400/30 outline-none bg-[#E3E3E3] text-sm rounded-3xl"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Shipping address"
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-400/30 outline-none bg-[#E3E3E3] text-sm rounded-3xl"
            />
          </div>
          <button
          onClick={redirectToCheckout}
            type="submit"
            className="w-full bg-[#2F456C] rounded-3xl text-white py-2.5 sm:py-3 cursor-pointer text-sm font-medium hover:bg-[#1a2156] transition-colors"
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddPaymentMethod

