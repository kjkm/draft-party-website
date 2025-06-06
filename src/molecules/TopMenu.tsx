import React from "react";

const TopMenu: React.FC = () => {
  const menuItems: string[] = ["Projects", "About", "Contact", "Party"];

  return (
    <div className="fixed top-0 left-0 w-full bg-malachite text-white shadow-lg z-50 rounded-b-3xl">
      <nav className="flex justify-center space-x-6 py-3">
        {menuItems.map((item: string) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="bg-sunshine text-malachite font-semibold px-4 py-2 rounded-full shadow hover:bg-sunrise hover:text-sunshine transition-all duration-200 ease-in-out"
          >
            {item}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default TopMenu;