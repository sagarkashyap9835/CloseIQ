import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menu = [
    { name: "Home", path: "/" },
    { name: "My Wardrobe", path: "/my-wardrobe" },
    { name: "AI Suggestions", path: "/ai-suggestions" },
    { name: "Weekly Planner", path: "/weekly-planner" },
    { name: "Profile", path: "/profile" },
  ];


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-green-100 shadow-md" : "bg-white"
      }`}
    >
      <div className="relative flex items-center justify-between px-6 md:px-12 py-4 text-gray-800">
        {/* Logo */}
        <h1 className="text-xl font-semibold tracking-wide text-[#1f4f47]">
          ClosetIQ
        </h1>

        {/*  Menu */}
        <div className="hidden md:flex items-center gap-6 ml-7 text-sm">
          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="relative overflow-hidden h-6 group"
            >
              <span className="block group-hover:-translate-y-full transition-transform duration-300">
                {item.name}
              </span>
              <span className="block absolute top-full left-0 group-hover:translate-y-[-100%] transition-transform duration-300 text-[#1f4f47]">
                {item.name}
              </span>
            </Link>
          ))}
        </div>


        <div className="button-bg rounded-full p-0.5 hover:scale-105 transition duration-300 active:scale-100">
          <button className="px-8 text-sm py-2.5 text-white rounded-full font-medium bg-gray-800">
            Click Me
          </button>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-700">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 bg-white w-full flex flex-col items-center gap-4 py-6 text-sm shadow-md md:hidden">
          {menu.map((item) => (
            <Link key={item.name} to={item.path} className="hover:text-[#1f4f47]">
              {item.name}
            </Link>
          ))}
          <button className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-full text-sm font-medium">
            Contact
          </button>
          <button className="bg-[#1f4f47] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#173c37] transition">
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}
