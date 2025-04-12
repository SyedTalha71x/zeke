/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import SingleCardImage from "../../public/single-card-image.svg";
import GiftRapped from "../../public/noto_wrapped-gift.svg";
import PackDetailCard from "../../public/PACK DETAILS.svg";
import { BASE_URL } from "../utils/api";
import { useParams } from "react-router-dom";

export default function PackDetails() {
  const {id} = useParams();
  const [showModal, setShowModal] = useState(false);
  const [cardPack, setCardPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCardPack = async () => {
      try {
        if (!id) {
          throw new Error("No pack ID provided");
        }
        
        const response = await fetch(`${BASE_URL}/get-single-card/${id}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Add hardcoded tier property to each card
        if (data.cards && data.cards.length > 0) {
          // Assign first 3 cards as tier 1, rest as tier 2
          data.cards = data.cards.map((card, index) => ({
            ...card,
            tier: index < 3 ? 1 : 2
          }));
        }
        
        setCardPack(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching card pack:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCardPack();
    
    const fromCheckout = new URLSearchParams(window.location.search).get("fromCheckout");
    if (fromCheckout === "true") {
      setShowModal(true);
    }
  }, [id]);

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  const redirect = () => {
    window.location.href = "/add-payment-method";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F456C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Filter cards by tier
  const tier1Cards = cardPack?.cards ? cardPack.cards.filter(card => card.tier === 1) : [];
  const tier2Cards = cardPack?.cards ? cardPack.cards.filter(card => card.tier === 2) : [];

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full mx-4 text-center relative">
            <div className="relative mb-4 flex justify-center items-center">
              <img src={GiftRapped} alt="Gift Wrapped" />
            </div>
            <h2 className="text-2xl hero_h1 mb-2">Congratulations!</h2>
            <p className="text-gray-700 text-sm">
              You have successfully unlocked the top-tier cards of {cardPack?.name}.
            </p>
            <p className="text-gray-600 text-sm mb-6">
              You will receive a confirmation email as soon as possible.
            </p>
            <button
              onClick={handleBackToHome}
              className="w-full bg-[#2F456C] text-white py-3 rounded-3xl hover:bg-[#374b73] transition-colors"
            >
              Back to home page &gt;&gt;
            </button>
          </div>
        </div>
      )}

      <main className="lg:mt-[10%] md:mt-[10%] sm:mt-[15%] mt-[30%]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="lg:text-4xl text-3xl hero_h1 mb-2">
              <img src={PackDetailCard} alt="Pack Detail" className="h-auto w-auto" />
              {cardPack?.name}
            </h1>
            <p className="text-gray-400 text-sm">
              {cardPack?.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod."}
            </p>
          </div>

          <div className="mt-10 bg-white p-6 rounded-2xl">
            <div className="flex lg:justify-between justify-center lg:flex-row flex-col items-center">
              <div>
                <h2 className="text-2xl hero_h1">Pack Cards</h2>
                <p className="text-gray-600 text-sm">
                  You will receive the best cards from the below cards.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-5 lg:mt-0">
                <span className="text-2xl hero_h1">${cardPack?.price?.toFixed(2) || "200.00"}</span>
                <button
                  onClick={redirect}
                  className="bg-[#2B3B5C] text-white lg:px-8 px-6 py-2 text-sm rounded-3xl hover:bg-[#374b73] transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>

            <div className="h-[1px] bg-slate-300/30 mt-7"></div>

            {tier1Cards.length > 0 && (
              <section className="mt-7">
                <h3 className="text-2xl text-gray-900 hero_h1">Tier 1 Cards (The big {tier1Cards.length})</h3>
                <div className="flex flex-wrap gap-6 mt-7">
                  {tier1Cards.map((card) => (
                    <div
                      key={card._id}
                      className="card-container bg-gray-100 p-4 rounded-xl shadow-lg"
                    >
                      <div className="card-flip">
                        <img 
                          src={card.imageUrl || SingleCardImage} 
                          alt={card.name || `Card ${card._id}`} 
                          className="w-40 h-48 object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {tier2Cards.length > 0 && (
              <>
                <div className="h-[1px] bg-slate-300/30 mt-7"></div>
                <section className="mt-7">
                  <h3 className="text-2xl text-gray-900 hero_h1">Tier 2 Cards</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-7">
                    {tier2Cards.map((card) => (
                      <div
                        key={card._id}
                        className="card-container bg-gray-100 p-4 rounded-xl shadow-lg"
                      >
                        <div className="card-flip">
                          <img 
                            src={card.imageUrl || SingleCardImage} 
                            alt={card.name || `Card ${card._id}`} 
                            className="w-full h-32 object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .card-container {
          perspective: 1000px;
          width: 180px;
          height: 220px;
        }

        .card-flip {
          transition: transform 1s ease;
          transform-style: preserve-3d;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-container:hover .card-flip {
          transform: rotateY(180deg);
        }
      `}</style>
    </>
  );
}