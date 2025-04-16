/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import CardsImage from "../../public/cards-image.svg";
import Tick from "../../public/Vector.svg";
import gradientTrending from "../../public/TRENDING.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import {BASE_URL} from "../utils/api"

function CardPack({ _id, boxCount, cardsAvailable, name, description, price }) {
  const navigate = useNavigate()

  const dynamicRedirect = (_id) => {
    navigate(`/card-details/${_id}`)
  }

  return (
    <div
      onClick={() => dynamicRedirect(_id)}
      className="bg-[#FFFFFF] rounded-2xl cursor-pointer p-4 flex flex-col group"
    >
      <div className="relative mb-4 p-4 bg-[#F3F3F3] rounded-xl">
        <div className="flex justify-start items-center gap-1">
          <div className="bg-[#9C6F34] text-white text-sm px-2 py-1 rounded">{boxCount} Boxes</div>
          <div className="px-2 py-1 rounded text-black bg-[#FFFFFF] text-sm">{cardsAvailable} cards available</div>
        </div>
        <div className="card-flip-wrapper">
          <img
            src={CardsImage || "/placeholder.svg"}
            alt="Sports cards pack"
            className="object-contain p-4 mix-blend-darken card-flip"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <img src={Tick || "/placeholder.svg"} alt="" />
        <span className="text-sm text-blue-500">Verified Cards</span>
      </div>

      <h3 className="text-xl hero_h1 mb-2">{name}</h3>
      <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>

      <div className="h-[1px] bg-slate-500/20 w-full"></div>

      <div className="flex items-center justify-between mt-5">
        <div className="text-xl flex items-center">
          <div className="text-sm text-gray-400">$</div>
          <div className="text-2xl">{price}</div>
          <div className="text-sm text-gray-400">.00</div>
        </div>
        <button className="px-6 py-2 border border-gray-600 rounded-3xl text-sm hover:bg-[#FFFFFF] cursor-pointer transition-all ease-in-out duration-500">
          View Details
        </button>
      </div>
    </div>
  )
}




export default function TrendingSection() {
  const [cardsPack, setcardsPack] = useState([])
  useEffect(() => {
    const fetchCardsData = async () =>{
      try{
        const response = await axios.get(`${BASE_URL}/get-all-cards`)
        const data = response.data;
        console.log(data);
        
        setcardsPack(data)
      }
      catch(error){
        console.log("Error while fetching cards data",error);
      }
    }
    fetchCardsData();
  }, [])
  


  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl hero_h1 mb-4 mt-16">
          <div className="">
            <img src={gradientTrending} alt="Trending" className="mx-auto" />
          </div>
          Our Trending <span className="text-[#C17F45]">Card Packs</span>
        </h2>
        <p className="text-[#000000B2] max-w-2xl text-sm mx-auto">
          Discover the ultimate destination for sports card enthusiasts. Shop
          exclusive packs, uncover rare finds, and relive iconic moments from
          your favorite sports. Start your collection today!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardsPack.slice(0,6).map((pack, index) => (
          <CardPack key={index} {...pack} />
        ))}
      </div>
      <div className="flex justify-center items-center mt-8">
        <Link to="/all-cards">
        <button className="bg-black hero_h1 text-white py-3 px-10 rounded-xl cursor-pointer text-sm hover:bg-gray-800 duration-500 transition-all font-semibold">See More Cards.....</button>
        </Link>
      </div>
    </section>
  );
}
