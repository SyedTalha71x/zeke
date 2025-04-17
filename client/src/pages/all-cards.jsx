/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/api";
import CardsImage from "../../public/cards-image.svg";
import Tick from "../../public/Vector.svg";

function AllCardsPage() {
  const navigate = useNavigate();
  const [cardsData, setCardsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const cardsPerPage = 10;

  useEffect(() => {
    const fetchCardsData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/get-all-cards`);
        const data = response.data;
        setCardsData(data);
        setTotalPages(Math.ceil(data.length / cardsPerPage));
        setLoading(false);
      } catch (error) {
        console.log("Error while fetching cards data", error);
        setLoading(false);
      }
    };
    fetchCardsData();
  }, []);

  // Get current cards for the current page
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cardsData.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCardClick = (id) => {
    navigate(`/card-details/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 md:w-[90%] w-full mx-auto mt-26">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl hero_h1 font-bold mb-4">
          All <span className="text-[#C17F45] hero_h1">Card Packs</span>
        </h2>
        <p className="text-[#000000B2]  max-w-2xl text-sm mx-auto">
          Browse our complete collection of sports card packs. Find rare cards,
          exclusive editions, and your favorite players.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentCards.map((card) => (
          <div
            key={card._id}
            onClick={() => handleCardClick(card._id)}
            className="bg-white rounded-2xl cursor-pointer p-4 flex flex-col group shadow-lg transition-shadow duration-300"
          >
            <div className="relative mb-4 p-4 bg-[#F3F3F3] rounded-xl">
              <div className="flex justify-start items-center gap-1">
                <div className="bg-[#9C6F34] text-white text-sm px-2 py-1 rounded">
                  {card.boxCount} Boxes
                </div>
                <div className="px-2 py-1 rounded text-black bg-white text-sm">
                  {card.cardsAvailable} cards available
                </div>
              </div>
              <div className="card-flip-wrapper">

              <img
                src={card.imageUrl || CardsImage}
                alt="Sports cards pack"
                className="object-contain p-4 mix-blend-darken card-flip w-full h-48"
                />
                </div>
            </div>

            <div className="flex items-center gap-1 mb-2">
              <img src={Tick} alt="Verified" className="w-4 h-4" />
              <span className="text-sm text-blue-500">Verified Cards</span>
            </div>

            <h3 className="text-lg font-semibold mb-2 line-clamp-1 hero_h1">{card.name}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {card.description}
            </p>

            <div className="border-t border-slate-200 w-full my-2"></div>

            <div className="flex items-center justify-between mt-3">
              <div className="text-xl flex items-center">
                <span className="text-sm text-gray-400">$</span>
                <span className="text-2xl ml-1">{card.price}</span>
                <span className="text-sm  text-gray-400">.00</span>
              </div>
              <button className="px-4 py-1.5 border border-gray-600 rounded-3xl text-sm hover:bg-gray-100 transition-all">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {cardsData.length > cardsPerPage && (
        <div className="flex justify-center mt-12">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium ${
                    currentPage === pageNum
                      ? "bg-[#C17F45] text-white border-[#C17F45]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2">...</span>
            )}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => paginate(totalPages)}
                className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {totalPages}
              </button>
            )}

            <button
              onClick={() =>
                paginate(currentPage < totalPages ? currentPage + 1 : totalPages)
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </section>
  );
}

export default AllCardsPage;