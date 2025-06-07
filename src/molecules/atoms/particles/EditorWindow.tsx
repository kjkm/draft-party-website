import React from 'react';
import { FaCode } from 'react-icons/fa'; 

type EditorWindowProps = {
  lines: string[];
  title?: string;
  style?: React.CSSProperties;
};

const EditorWindow: React.FC<EditorWindowProps> = ({
  lines,
  title = "index.tsx",
  style = {},
}) => {
  // Define any default inline styles you want.
  const defaultStyle: React.CSSProperties = {
    // for example, set padding or margins if needed
    // padding: "1rem",
  };

  return (
    <div
      style={{ ...defaultStyle, ...style }}
      className="bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm rounded-md overflow-hidden shadow-lg w-full max-w-2xl border border-[#333]"
    >
      <div className="bg-[#2d2d2d] flex items-center space-x-2 px-4 py-2 border-b border-[#333]">
        <FaCode className="text-[#d4d4d4]" />
        <span className="text-[#d4d4d4] text-sm">{title}</span>
      </div>

      <div className="p-4 overflow-auto">
        <div className="flex flex-col space-y-1">
          {lines.map((line, index) => (
            <div key={index} className="flex">
              <span className="w-10 text-right pr-4 text-[#858585] select-none">
                {index + 1}
              </span>
              <span className="whitespace-pre">{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorWindow;