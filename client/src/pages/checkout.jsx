import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import GooglePay from "../../public/logos_google-pay.svg";
import ApplePay from "../../public/logos_apple-pay.svg";
import MasterCard from "../../public/logos_mastercard.svg";

export default function CheckoutPage() {
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [isPaymentOpen, setIsPaymentOpen] = useState(true);
  const [isProtectionOpen, setIsProtectionOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Checkout submitted:", { email, promoCode, selectedPayment });
    window.location.href = "/card-details-pack/1?fromCheckout=true"

  };

  const redirectToSingle = () => {
    window.location.href = "/card-details-pack/1";
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="bg-[#211F1F] text-white p-6">
        <button
          onClick={redirectToSingle}
          className="flex items-center gap-2 text-sm bg-[#2C2C2C] px-4 py-3 cursor-pointer rounded-full mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="lg:w-[90%] w-full mx-auto mt-[20%]">
          <div className="mb-12">
            <h1 className="text-lg mb-2 hero_h1">Pull Zone</h1>
            <div className="text-5xl font-bold">$155.67</div>
          </div>

          <div className="mb-8">
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="add promotion code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-[#2C2C2C] text-[#FFFFFF] outline-none text-sm px-4 py-2 rounded-3xl "
              />
              <button className="bg-[#FFFFFF] text-black px-8 py-2 cursor-pointer rounded-3xl  hover:bg-[#3C3C3C] hover:text-white transition-all duration-500 ease-in-out">
                Add
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span>Card Pack</span>
                <span className="font-bold">$25.00</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">$25.00</span>
              </div>
              <div className="flex justify-between border-t border-[#2C2C2C] pt-4">
                <span>Sales Tax (3.34%)</span>
                <span className="font-bold">$25.00</span>
              </div>
              <div className="flex justify-between border-t border-[#2C2C2C] pt-4">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="font-bold text-lg">$25.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" p-4  mt-[8%]">
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto bg-[#FFFFFF] p-6 rounded-xl space-y-6"
        >
          <div>
            <h2 className="text-lg hero_h1 mb-4 ">Link</h2>
            <div className="h-[1px] bg-slate-400/30"></div>
            <div className="mt-2 flex flex-col justify-start items-start">
              <label
                htmlFor="email"
                className="text-gray-900 text-sm font-semibold "
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 mt-2 text-sm bg-[#E3E3E380] rounded-3xl outline-none"
                required
              />
            </div>
          </div>
          <div className="h-[1px] bg-slate-400/30"></div>

          <div className="">
            <button
              type="button"
              onClick={() => setIsPaymentOpen(!isPaymentOpen)}
              className="w-full hero_h1  flex items-center justify-between text-lg font-semibold mb-4"
            >
              Pay with
              {isPaymentOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {isPaymentOpen && (
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-[#E3E3E3] border border-gray-200 rounded-xl cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={selectedPayment === "card"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex items-center gap-2">
                      <img
                        src={MasterCard}
                        alt="Mastercard"
                        width={32}
                        height={20}
                        className="w-8 "
                      />
                      <div className="">
                        <div className="font-semibold">Master Card (****44)</div>
                        <div className="text-sm text-gray-500">09/12/2023</div>
                      </div>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-gray-300"></div>
                </label>

                <label className="flex items-center justify-between p-4 bg-[#E3E3E3] border border-gray-200 rounded-xl cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="google"
                      checked={selectedPayment === "google"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex items-center gap-2">
                      <img
                        src={GooglePay}
                        alt="Google Pay"
                        width={32}
                        height={20}
                        className="w-8"
                      />
                      <div>
                        <div className="font-semibold">Google Pay</div>
                        <div className="text-sm text-gray-500">
                          test@gmail.com
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-gray-300"></div>
                </label>

                <label className="flex items-center justify-between p-4 bg-[#E3E3E3] border border-gray-200 rounded-xl cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="apple"
                      checked={selectedPayment === "apple"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex items-center gap-2">
                      <img
                        src={ApplePay}
                        alt="Apple Pay"
                        width={32}
                        height={20}
                        className="w-8"
                      />
                      <div>
                        <div className="font-semibold">Apple Pay</div>
                        <div className="text-sm text-gray-500">
                          test@icloud.com
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-gray-300"></div>
                </label>
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsProtectionOpen(!isProtectionOpen)}
              className="w-full flex hero_h1 items-center justify-between text-lg font-semibold mb-1"
            >
              Free damage protection
              {isProtectionOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {isProtectionOpen && (
              <div className="text-sm text-gray-600">
                <p>
                  Includes damage coverage, no-return item protection and more.
                </p>
                <a href="/" className="text-blue-600 underline">
                  Terms apply
                </a>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#2F456C] text-white py-3 rounded-3xl cursor-pointer hover:bg-[#374b73] transition-colors"
          >
            Confirm Purchase of $25.91
          </button>
        </form>
      </div>
    </div>
  );
}
