import { useState } from "react"
import Contact from "../../public/contact.svg"
import ContactTrending from '../../public/CONTACT.svg'
import { BASE_URL } from "../utils/api";
import toast, { Toaster } from "react-hot-toast";

export default function FeedbackSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${BASE_URL}/create-contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: 'Message sent successfully!'
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
        toast.success('Message sent successfully, we will get back to your shortly!');
      } else {
        setSubmitStatus({
          success: false,
          message: data.message || 'Failed to send message. Please try again.'
        });
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({
        success: false,
        message: 'Network error. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
      // Clear status message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({
          success: false,
          message: ""
        });
      }, 5000);
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <>
   <Toaster position="top-right"/>
    <section className=" mt-16 pb-10">
      <div className="max-w-7xl  mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl hero_h1 mb-4">
            <div>
                <img src={ContactTrending} alt="" className="mx-auto" />
            </div>
            Share your <span className="text-[#C17F45] ">Feedback</span>
          </h2>
          <p className="text-gray-600 max-w-2xl text-sm mx-auto">
            Discover the ultimate destination for sports card enthusiasts. Shop exclusive packs, uncover rare finds, and
            relive iconic moments from your favorite sports. Start your collection today!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center bg-[#FFFFFF] rounded-xl p-7">
          <div>
            <div className="mb-8">
              <h3 className="text-md text-black mb-2">Get in Touch</h3>
              <h4 className="text-4xl hero_h1">Share your Valuable feedback</h4>
              <p className="text-sm text-gray-600 mt-2">Let us know a little bit about what you looking for below.</p>
            
            <div className="h-[3px] bg-red-600 w-24 mr-auto mt-4"></div>
            </div>

            {submitStatus.message && (
              <div className={`mb-4 p-3 rounded-md ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl  bg-[#FAF8F6] outline-none text-sm"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl  bg-[#FAF8F6] outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl  bg-[#FAF8F6] outline-none text-sm"
                  required
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Message us"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl  bg-[#FAF8F6] outline-none text-sm resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#2F456C] text-white py-3 rounded-3xl cursor-pointer hover:bg-[#2c3952] transition-all ease-in-out duration-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : 'Send message'}
              </button>
            </form>
          </div>

          <div className="relative aspect-square rounded-2xl overflow-hidden bg-black">
            <img
              src={Contact}
              alt="Vintage telephone"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}