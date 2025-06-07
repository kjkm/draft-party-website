import React, { useState } from "react";

const TopMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems: string[] = ["Join", "About", "Gallery", "Contact"];

  return (
    <div className="fixed top-0 left-0 w-full bg-malachite text-white shadow-lg z-50">
      <div className="flex justify-between items-center px-4 py-3 md:py-3 md:px-6">
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>
      <nav
        className={`${
          isOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6 py-3`}
      >
        {menuItems.map((item: string) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="inline-block text-center bg-sunshine text-malachite font-semibold px-4 py-2 rounded-full shadow hover:bg-sunrise hover:text-sunshine transition-all duration-200 ease-in-out"
          >
            {item}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default TopMenu;