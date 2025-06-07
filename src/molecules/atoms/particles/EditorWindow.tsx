import React, { useRef, useEffect, useState } from 'react';
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
  const defaultStyle: React.CSSProperties = {};

  const containerRef = useRef<HTMLDivElement>(null);
  const [maxChars, setMaxChars] = useState<number>(25);

  useEffect(() => {
    const updateMaxChars = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.font = "14px monospace";
          const averageCharWidth = ctx.measureText("M").width;
          const computedMaxChars = Math.floor(containerWidth / averageCharWidth) - 10;
          setMaxChars(computedMaxChars > 0 ? computedMaxChars : 25);
        }
      }
    };

    updateMaxChars();
    window.addEventListener('resize', updateMaxChars);
    return () => window.removeEventListener('resize', updateMaxChars);
  }, []);

  const splitLine = (line: string, maxChars: number): string[] => {
    if (line === "") {
      return [""];
    }

    const words = line.split(' ');
    const wrappedLines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + (currentLine ? ' ' : '') + word).length > maxChars) {
        wrappedLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine += (currentLine ? ' ' : '') + word;
      }
    });
    if (currentLine) {
      wrappedLines.push(currentLine);
    }

    return wrappedLines;
  };

  const processedLines: string[] = [];
  lines.forEach(line => {
    const splits = splitLine(line, maxChars);
    processedLines.push(...splits);
  });

  return (
    <div
      ref={containerRef}
      style={{ ...defaultStyle, ...style }}
      className="bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm rounded-md overflow-hidden shadow-lg w-full max-w-2xl border border-[#333]"
    >
      <div className="bg-[#2d2d2d] flex items-center space-x-2 px-4 py-2 border-b border-[#333]">
        <FaCode className="text-[#d4d4d4]" />
        <span className="text-[#d4d4d4] text-sm">{title}</span>
      </div>

      <div className="p-4 overflow-auto">
        <div className="flex flex-col space-y-1">
          {processedLines.map((line, index) => (
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