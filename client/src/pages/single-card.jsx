/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import SingleCardImage from "../../public/single-card-image.svg";
import GiftRapped from "../../public/noto_wrapped-gift.svg";
import PackDetailCard from "../../public/PACK DETAILS.svg";

export default function PackDetails() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fromCheckout = new URLSearchParams(window.location.search).get("fromCheckout");
    if (fromCheckout === "true") {
      setShowModal(true);
    }
  }, []);

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  const cards = [
    ...[1, 2, 3].map((id) => ({
      id,
      tier: 1,
      imageUrl: SingleCardImage,
    })),
    ...Array.from({ length: 15 }, (_, i) => ({
      id: i + 4,
      tier: 2,
      imageUrl: SingleCardImage,
    })),
  ];

  const redirect = () => {
    window.location.href = "/add-payment-method";
  };

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
              You have successfully unlocked the top-tier cards of a pack name here.
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
              Pack Name here...
            </h1>
            <p className="text-gray-400 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
            </p>
          </div>

          <div className="mt-10 bg-white p-6 rounded-2xl">
            <div className="flex lg:justify-between justify-center lg:flex-row flex-col items-center ">
              <div>
                <h2 className="text-2xl hero_h1">Pack Cards</h2>
                <p className="text-gray-600 text-sm">
                  You will receive the best cards from the below cards.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-5 lg:mt-0">
                <span className="text-2xl hero_h1">$200.00</span>
                <button
                  onClick={redirect}
                  className="bg-[#2B3B5C] text-white lg:px-8 px-6 py-2 text-sm rounded-3xl hover:bg-[#374b73] transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>

            <div className="h-[1px] bg-slate-300/30 mt-7"></div>

            {/* Tier 1 Cards */}
            <section className="mt-7">
              <h3 className="text-2xl text-gray-900 hero_h1">Tier 1 Cards (The big 3)</h3>
              <div className="flex flex-wrap gap-6 mt-7">
                {cards.filter((card) => card.tier === 1).map((card) => (
                  <div
                    key={card.id}
                    className="card-container bg-gray-100 p-4 rounded-xl shadow-lg"
                  >
                    <div className="card-flip">
                      <img src={card.imageUrl} alt={`Card ${card.id}`} className="p-2 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-[1px] bg-slate-300/30 mt-7"></div>

            {/* Tier 2 Cards */}
            <section className="mt-7">
              <h3 className="text-2xl text-gray-900 hero_h1">Tier 2 Cards</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-7">
                {cards.filter((card) => card.tier === 2).map((card) => (
                  <div
                    key={card.id}
                    className="card-container bg-gray-100 p-4 rounded-xl shadow-lg"
                  >
                    <div className="card-flip">
                      <img src={card.imageUrl} alt={`Card ${card.id}`} className="p-2 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <style jsx>{`
        .card-container {
          perspective: 1000px;
        }

        .card-flip {
          transition: transform 1s ease;
          transform-style: preserve-3d;
        }

        .card-container:hover .card-flip {
          transform: rotateY(180deg);
        }
      `}</style>
    </>
  );
}
