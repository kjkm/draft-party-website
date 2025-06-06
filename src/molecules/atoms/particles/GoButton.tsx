import React from "react";

type GoButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const GoButton: React.FC<GoButtonProps> = ({
  onClick,
  children,
  className = "",
  style = {},
}) => {
  return (
    <button
      onClick={onClick}
      style={{ fontFamily: "Oswald, sans-serif", ...style }}
      className={`
        flex items-center justify-center gap-2 
        px-3 py-2 
        text-white bg-transparent
        rounded-md
        transition-all duration-300 ease-in-out 
        hover:scale-105 hover:shadow-blue-400 hover:shadow-lg
        hover:bg-sunrise hover:text-sunshine
        focus:outline-none
        font-oswald
        ${className}
      `}
    >
      {children}
      <span className="text-xl sm:text-xl md:text-4xl lg:text-5xl">
        start the party ➜
      </span>
    </button>
  );
};

export default GoButton;
