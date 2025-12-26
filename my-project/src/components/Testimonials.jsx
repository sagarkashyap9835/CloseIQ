import React from "react";

const testimonials = [
  {
    quote: "“ClosetIQ completely transformed my morning routine—no more outfit stress!”",
    name: "Alice Smith",
    role: "Fashion Blogger",
    size: "small",
    img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=600",
  },
  {
    quote: "“I love how ClosetIQ helps me track my style evolution—feeling confident every day.”",
    name: "Michael Lee",
    role: "Digital Marketer",
    size: "medium",
    img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=600",
  },
  {
    quote: "“Shopping smarter is now easy! ClosetIQ shows me what I already own and saves money.”",
    name: "Sofia Johnson",
    role: "Content Creator",
    size: "large",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&h=600&auto=format&fit=crop",
  },
];

export default function Testimonials() {
  const sizeClasses = {
    small: "w-56",
    medium: "w-72",
    large: "w-80",
  };

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Testimonials</h2>
        <p className="text-gray-600">
          Hear from our users how ClosetIQ has transformed their fashion routine, helped them save time, and boosted confidence in their daily style.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className={`${sizeClasses[item.size]} bg-black text-white rounded-2xl`}
          >
            <div className="relative -mt-px overflow-hidden rounded-2xl">
              <img
                src={item.img}
                alt={item.name}
                className="h-[220px] w-full rounded-2xl hover:scale-105 transition-all duration-300 object-cover object-top"
              />
              <div className="absolute bottom-0 z-10 h-44 w-full bg-gradient-to-t pointer-events-none from-black to-transparent"></div>
            </div>
            <div className="px-4 pb-4">
              <p className="font-medium border-b border-gray-600 pb-4">{item.quote}</p>
              <p className="mt-3 text-emerald-500 font-semibold">— {item.name}</p>
              <p className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] via-[#E0724A] to-[#9938CA] text-transparent bg-clip-text">
                {item.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
