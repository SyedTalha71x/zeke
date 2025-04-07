/* eslint-disable no-unused-vars */
import React from "react";
import Home from "../../public/HOME.svg";
import TrendingSection from "./trending-cards";
import FeedbackSection from "./feedback";

export default function Hero() {
  return (
    <>
      <div className="relative h-screen w-full">
        <div className="absolute inset-0 h-full">
          <img
            src={Home}
            alt="Sports cards collection"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 h-full bg-black/40" />
        </div>

        <div className="absolute bottom-16 left-0 w-full">
          <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-4xl hero_h1 sm:text-5xl lg:text-6xl leading-tight mb-6">
              Unlock Rare Finds With
              <br />
              Every Sports Card Pack!
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mb-8 text-gray-200">
              Discover the ultimate destination for sports card enthusiasts.
              Shop exclusive packs, uncover rare finds, and relive iconic
              moments from your favorite sports. Start your collection today!
            </p>
            <button className="inline-flex items-center cursor-pointer px-6 py-3 border-2 border-white rounded-3xl text-base font-medium text-white bg-transparent hover:bg-[#FFFFFF] hover:text-black transition-all ease-in-out duration-500  ">
              EXPLORE PACKS
            </button>
          </div>
        </div>
      </div>

      <TrendingSection />
      <FeedbackSection/>
    </>
  );
}
