export default function BillingSection() {
    return (
      <section className="p-4 lg:w-[50%] shadow-lg w-full rounded-md mr-auto bg-[#FFFFFF]">
        <div className="">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold hero_h1">Billing address</h2>
            <button className="text-[#987C5D] text-sm cursor-pointer underline" onClick={() => console.log("Edit clicked")}>
              Edit
            </button>
          </div>
  
          <div className="space-y-3">
            <div className="text-gray-700 text-sm">kevinbacker234@gmail.com</div>
            <div className="text-gray-700 text-sm">United States</div>
            <div className="text-gray-700 text-sm">90001</div>
            <div className="text-gray-700 text-sm">Street 3, Wilson road, California</div>
          </div>
        </div>
      </section>
    )
  }
  
  