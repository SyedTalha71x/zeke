/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/api";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ amount, email, onSuccess, cardPack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const token = localStorage.getItem('authToken')

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Total',
        amount: Math.round(amount * 100), // amount in cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestShipping: true,
    });

    pr.canMakePayment().then(result => {
      setCanMakePayment(!!result);
    });

    pr.on('paymentmethod', async (ev) => {
      setLoading(true);
      
      try {
      
        const response = await fetch(`${BASE_URL}/create-payment-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },

          body: JSON.stringify({ 
            amount, 
            cardPackId: cardPack?._id,
            paymentMethodType: 'card',
            metadata: {
              productName: 'Card Pack',
              customerEmail: email
            }
          }),
        });

        const { clientSecret } = await response.json();

        // Confirm the PaymentIntent
        const { error: confirmError } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        );

        if (confirmError) {
          ev.complete('fail');
          setError(confirmError.message);
          setLoading(false);
          return;
        }

        ev.complete('success');
        onSuccess();
      } catch (err) {
        ev.complete('fail');
        setError(err.message);
        setLoading(false);
      }
    });

    setPaymentRequest(pr);
  }, [stripe, amount, email]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${token}`},
        body: JSON.stringify({ 
          amount, 
          cardPackId: cardPack?._id,
          paymentMethodType: 'card',
          metadata: {
            productName: 'Card Pack',
            customerEmail: email,
            customerName: name,
            shippingAddress: address
          }
        }),
      });

      const { clientSecret } = await response.json();

      const { error: paymentError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: name,
            email: email,
            address: {
              line1: address
            }
          },
        },
      });

      if (paymentError) {
        setError(paymentError.message);
        setLoading(false);
        return;
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">{error}</div>}
      
      <div>
        <label htmlFor="name" className="text-gray-900 text-sm font-semibold">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 mt-2 text-sm bg-[#E3E3E380] rounded-3xl outline-none"
        />
      </div>

      <div>
        <label htmlFor="address" className="text-gray-900 text-sm font-semibold">
          Shipping Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="w-full px-4 py-3 mt-2 text-sm bg-[#E3E3E380] rounded-3xl outline-none"
        />
      </div>

      {canMakePayment && (
        <div className="border rounded-xl p-4 bg-[#E3E3E3]">
          <PaymentRequestButtonElement 
            options={{ 
              paymentRequest,
              style: {
                paymentRequestButton: {
                  type: 'buy',
                  theme: 'dark',
                  height: '48px'
                }
              }
            }} 
          />
        </div>
      )}

      <div className="border rounded-xl p-4 bg-[#E3E3E3]">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
                padding: '10px 12px',
              },
              invalid: {
                color: '#9e2146',
              },
            },
            hidePostalCode: true
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[#2F456C] rounded-3xl text-white py-3 cursor-pointer text-sm font-medium hover:bg-[#1a2156] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'import.metaing...' : `Confirm Purchase of $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isProtectionOpen, setIsProtectionOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardPack, setCardPack] = useState(null);

  useEffect(() => {
    if (location.state?.cardPack) {
      setCardPack(location.state.cardPack);
    } else {
      const fetchCardPack = async () => {
        try {
          const packId = new URLSearchParams(location.search).get('packId');
          if (!packId) return;
          
          const response = await fetch(`${BASE_URL}/get-single-card/${packId}`);
          const data = await response.json();
          setCardPack(data);
        } catch (error) {
          console.error("Error fetching card pack:", error);
        }
      };
      fetchCardPack();
    }
  }, [location]);

  const totalAmount = cardPack?.price || 25.00;
  const taxAmount = totalAmount * 0.0334;
  const grandTotal = totalAmount + taxAmount;

  const redirectToSingle = () => {
    navigate(-1); 
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    navigate(`/card-details/${cardPack?._id}?fromCheckout=true`);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
          <p>Your order has been import.metaed successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left side - Order Summary */}
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
            <h1 className="text-lg mb-2 hero_h1">{cardPack?.name || 'Card Pack'}</h1>
            <div className="text-5xl font-bold">${grandTotal.toFixed(2)}</div>
          </div>

          <div className="mb-8">
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="add promotion code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-[#2C2C2C] text-[#FFFFFF] outline-none text-sm px-4 py-2 rounded-3xl"
              />
              <button 
                type="button"
                className="bg-[#FFFFFF] text-black px-8 py-2 cursor-pointer rounded-3xl hover:bg-[#3C3C3C] hover:text-white transition-all duration-500 ease-in-out"
              >
                Add
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span>Card Pack</span>
                <span className="font-bold">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-[#2C2C2C] pt-4">
                <span>Sales Tax (3.34%)</span>
                <span className="font-bold">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-[#2C2C2C] pt-4">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="font-bold text-lg">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Payment Form */}
      <div className="p-4 mt-[8%]">
        <div className="max-w-md mx-auto bg-[#FFFFFF] p-6 rounded-xl space-y-6">
          <div>
            <h2 className="text-lg hero_h1 mb-4">Link</h2>
            <div className="h-[1px] bg-slate-400/30"></div>
            <div className="mt-2 flex flex-col justify-start items-start">
              <label htmlFor="email" className="text-gray-900 text-sm font-semibold">
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

          <div>
            <h2 className="text-lg hero_h1 mb-4">Payment Method</h2>
            
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                amount={grandTotal} 
                email={email}
                onSuccess={handlePaymentSuccess} 
                cardPack={cardPack}
              />
            </Elements>
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
        </div>
      </div>
    </div>
  );
}