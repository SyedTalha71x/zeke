import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"
import gsap from "gsap"
import FAQSImage from '../../public/FAQS.svg'

const FAQPage = () => {
  const faqs = [
    {
      question: "Lorem ipsum dolor sit amet consectetur adipiscing?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      question: "Duis aute irure dolor in reprehenderit?",
      answer: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      question: "Sed ut perspiciatis unde omnis iste natus?",
      answer: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    },
    {
      question: "Nemo enim ipsam voluptatem quia voluptas?",
      answer: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
    },
    {
      question: "At vero eos et accusamus et iusto odio?",
      answer: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
    },
    {
      question: "Nam libero tempore, cum soluta nobis?",
      answer: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus temporibus autem.",
    },
  ]

  // Initialize with all indexes open
  const [openIndexes, setOpenIndexes] = useState(
    new Set(faqs.map((_, index) => index))
  )
  
  const answerRefs = useRef([])
  const contentRefs = useRef([])

  const toggleFAQ = (index) => {
    const newOpenIndexes = new Set(openIndexes)
    if (newOpenIndexes.has(index)) {
      newOpenIndexes.delete(index)
    } else {
      newOpenIndexes.add(index)
    }
    setOpenIndexes(newOpenIndexes)
  }

  // Animation for a single FAQ item
  const animateFAQ = (answer, content, isOpen) => {
    if (!answer || !content) return

    gsap.killTweensOf(answer)
    
    if (isOpen) {
      const contentHeight = content.offsetHeight
      gsap.fromTo(answer,
        { height: answer.offsetHeight || 0 },
        {
          height: contentHeight,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => gsap.set(answer, { height: "auto" })
        }
      )
    } else {
      // Ensure we start from current height for smooth closing
      gsap.fromTo(answer,
        { height: answer.offsetHeight },
        {
          height: 0,
          duration: 0.3,
          ease: "power2.inOut",
        }
      )
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      answerRefs.current.forEach((answer, index) => {
        const content = contentRefs.current[index]
        const isOpen = openIndexes.has(index)
        animateFAQ(answer, content, isOpen)
      })
    })

    return () => ctx.revert()
  }, [openIndexes])

  return (
    <div className="lg:mt-[10%] md:mt-[15%] sm:mt-[50%] mt-[50%] px-4 md:px-0 pb-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <img src={FAQSImage} alt="FAQs"  />
          </div>
          <h1 className="text-4xl lg:text-5xl font-semibold hero_h1 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-700 text-md max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="rounded-lg border bg-[#FFFFFF] border-gray-400/30 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center cursor-pointer justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-200"
                aria-expanded={openIndexes.has(index)}
              >
                <span className="font-medium hero_h1">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 transform transition-transform duration-300 ${
                    openIndexes.has(index) ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div className="h-[1px] bg-slate-500/30" />
              <div
                ref={el => answerRefs.current[index] = el}
                className="overflow-hidden"
                style={{ height: "auto" }} 
              >
                <div 
                  ref={el => contentRefs.current[index] = el}
                  className="p-4 pt-3 text-sm text-gray-600"
                >
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQPage