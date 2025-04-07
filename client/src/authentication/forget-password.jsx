/* eslint-disable react/no-unescaped-entities */
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import NavbarTitle from '../../public/navbar-title.svg'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Reset password email sent to:", email)
  }

  return (
    <div className="min-h-screen  flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-3 sm:mb-4">
            <img
              src={NavbarTitle}
              alt="Hitsphere Logo"
              className="h-auto w-auto max-w-[200px] sm:max-w-none"
            />
          </div>
          <p className="text-gray-700 text-xs sm:text-sm px-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incidi
          </p>
        </div>

        <div className="form-content">
          <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            <div>
              <input
                type="email"
                name="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block bg-[#E3E3E380] outline-none text-xs sm:text-sm rounded-xl sm:rounded-2xl w-full px-3 py-2.5 sm:py-3 placeholder-gray-500 text-gray-900"
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2.5 sm:py-3 cursor-pointer border border-transparent text-xs sm:text-sm font-medium rounded-xl sm:rounded-2xl text-white bg-[#2F456C] hover:bg-[#374b73] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B3B5C]"
              >
                Send reset password link
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-xs sm:text-sm">
          <p className="text-gray-600">
            Back to?{" "}
            <button 
              onClick={() => navigate("/login-signup")} 
              className="text-red-600 cursor-pointer underline underline-offset-3 hover:text-[#a66832] font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}