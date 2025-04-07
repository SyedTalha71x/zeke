import CardsImage from "../../public/single-card-image.svg"

const RewardsSection = () => {
  return (
    <section className="w-full rounded-md shadow-lg bg-[#FFFFFF] overflow-x-hidden p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl hero_h1 mb-6">My Rewards</h1>

        <div className="mb-8 bg-gray-50 p-4 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-sm text-gray-800 mb-1">Tier 1 cards</h2>
              <p className="text-lg font-medium hero_h1">Pack name here</p>
            </div>
            <button className="px-4 py-2 bg-[#987C5D] text-white rounded-3xl text-sm cursor-pointer hover:bg-[#8B7355] transition-colors whitespace-nowrap">
              Download Cards
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((card) => (
              <div key={card} className="bg-gray-100 rounded-lg p-4">
                <div className="w-full h-64 flex justify-center items-center overflow-hidden rounded-lg">
                  <img
                    src={CardsImage}
                    alt={`Trading Card ${card}`}
                    className="w-auto h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default RewardsSection
