import { useState } from "react";

const HelpContent = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const faqs = [
    {
      question:
        "How will this platform keep alumni information accurate and up-to-date?",
      answer:
        "The platform uses regular updates and verification processes, allowing users to edit their profiles and administrators to validate information.",
    },
    {
      question: "How does the platform foster meaningful alumni engagement?",
      answer:
        "Through networking tools, discussion forums, and event organization features, the platform encourages alumni to connect and collaborate.",
    },
    {
      question:
        "Can the platform help alumni and students find career opportunities or support professional development?",
      answer:
        "Yes, the platform provides job boards, mentorship programs, and resources for skill-building and career growth.",
    },
    {
      question: "How does the platform simplify managing events and reunions?",
      answer:
        "With integrated event management tools, users can create, promote, and manage events, including RSVP tracking and notifications.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  // Filter FAQs based on the search query
  const filteredFAQs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-100 mx-auto py-12 px-6 bg-white">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-4 text-center">
        Help Center
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Find answers to your questions or learn more about the functionalities
        of the platform.
      </p>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search FAQs..."
          className="w-full p-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        />
      </div>

      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <div className="text-center text-gray-600">No results found</div>
        ) : (
          filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg bg-white shadow-md"
            >
              <button
                className="w-full text-left px-5 py-4 flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-gray-800 font-medium text-lg">
                  {faq.question}
                </span>
                <span className="text-gray-500 text-lg font-bold">
                  {activeIndex === index ? "-" : "+"}
                </span>
              </button>
              {activeIndex === index && (
                <div className="px-5 py-4 text-gray-700 text-base leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HelpContent;
