import { useState } from "react";
import { Facebook, Instagram } from "lucide-react";
import NavLogo from "../../public/nav_logo.svg";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
  };

  return (
    <footer className="bg-gradient-to-r from-[#30456C] to-[#536585]  text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white/10 rounded-xl p-6 mb-12">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-3xl hero_h1 mb-2">Stay in Touch</h2>
              <p className="text-gray-300 text-sm mb-4">
                Sign up to hear about the latest drops and card packs.
              </p>
              <div className="flex gap-4 mt-2">
                <a href="#" className="hover:opacity-80">
                  <Facebook className="w-6 h-6" />
                  <span className="sr-only">Facebook</span>
                </a>
                <a href="#" className="hover:opacity-80">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  <span className="sr-only">TikTok</span>
                </a>
                <a href="#" className="hover:opacity-80">
                  <Instagram className="w-6 h-6" />
                  <span className="sr-only">Instagram</span>
                </a>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="">
              <div className="w-full">
                <input
                  type="email"
                  placeholder="Enter email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 rounded-3xl  text-sm bg-transparent border border-white/10 text-white placeholder-gray-100 outline-none"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="px-8 py-2.5 mt-2 font-bold rounded-3xl bg-[#FFFFFF] text-[#2B3B5C] hover:bg-gray-100 cursor-pointer text-sm transition-colors"
                >
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row  justify-between items-center mb-12">
          <Link to={"/"} className="mb-6 md:mb-0">
            <img src={NavLogo} alt="" />
          </Link>
          <nav className="flex flex-wrap justify-center gap-10">
            <Link to={"/user-profile/my-orders"} className="text-[#FFFFFF] text-sm hover:text-white">
              My Orders
            </Link>
            <Link to={"/user-profile/dashboard"} className="text-[#FFFFFF] text-sm hover:text-white">
              My Account
            </Link>
            <Link to={"/faqs"} className="text-[#FFFFFF] text-sm hover:text-white">
              FAQs
            </Link>
            <Link to={"/privacy-policy"} className="text-[#FFFFFF] text-sm hover:text-white">
              Privacy Policy
            </Link>
          </nav>
        </div>

        <div className="h-[1px] bg-slate-200/20 w-full mb-2 "></div>

        <div className="text-center mt-7 text-[#FFFFFF] text-sm">
          <p className="flex justify-center items-center gap-1">
            Copyright <span className="inline-block">&copy;</span>{" "}
            <div className="font-bold">Hitsphere</div> . All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
