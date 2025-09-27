// import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Gujarat Technical University",
      date: "Mar 12, 2024",
      review:
        "At Network_Next, we believe that our transformation comes from consistently delivering value through exceptional solutions. Our unique approach has earned us:",
      rating: 4,
      avatar: "https://via.placeholder.com/50", // Replace with actual avatar URL
    },
    {
      id: 2,
      name: "OP Jindal University",
      date: "Mar 12, 2024",
      review:
        "At Network_Next, we believe that our transformation comes from consistently delivering value through exceptional solutions. Our unique approach has earned us:",
      rating: 4,
      avatar: "https://via.placeholder.com/50", // Replace with actual avatar URL
    },
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1 mt-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={`text-lg ${
              index < rating ? "text-blue-500" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="bg-white py-12 px-6">
      {/* Section Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-black">
          What Our Clients Say
        </h2>
      </div>

      {/* Testimonials */}
      <div className="space-y-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="grid grid-cols-[50px,1fr] gap-x-4 max-w-4xl mx-auto"
          >
            {/* Avatar */}
            <div>
              <img
                src={testimonial.avatar}
                alt={`${testimonial.name}'s avatar`}
                className="w-12 h-12 rounded-full"
              />
            </div>

            {/* Content */}
            <div>
              {/* Name and Date */}
              <div>
                <h3 className="font-semibold text-black text-base leading-tight">
                  {testimonial.name}
                </h3>
                <p className="text-gray-400 text-sm">{testimonial.date}</p>
              </div>

              {/* Stars and Review */}
              <div className="mt-1">
                {renderStars(testimonial.rating)}
                <p className="text-gray-800 mt-2 text-sm font-bold leading-relaxed">
                  {testimonial.review}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="py-8"></div>
    </section>
  );
};

export default Testimonials;
