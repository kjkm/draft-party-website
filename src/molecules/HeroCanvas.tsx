import React, { useEffect, useState } from "react";
import ParallaxBackground from "./atoms/ParallaxBackground";
import DustBackground from "./atoms/DustBackground";
import AnimatedBackground from "./atoms/AnimatedBackground";
import GoButton from "./atoms/particles/GoButton";
import EditorWindow from "./atoms/particles/EditorWindow";

const HeroCanvas: React.FC = () => {
  const [topOffset, setTopOffset] = useState(0);
  const [leftOffset, setLeftOffset] = useState(0);
  const [dynamicFontSize, setDynamicFontSize] = useState(0);

  useEffect(() => {
    const updateOffsets = () => {
      const dynamicFontSize = Math.min(window.innerWidth / 10, 104);
      setDynamicFontSize(dynamicFontSize);

      const numLines = 3;

      const textStartingPoint = 0.4 * window.innerHeight;
      const textHeight = numLines * dynamicFontSize;
      const computedTop = textStartingPoint + textHeight;
      setTopOffset(computedTop);

      const computedLeft = window.innerWidth * 0.25 + dynamicFontSize * 3;
      setLeftOffset(computedLeft);
    };

    updateOffsets();
    window.addEventListener("resize", updateOffsets);
    return () => window.removeEventListener("resize", updateOffsets);
  }, []);

  return (
    <>
      <ParallaxBackground />
      <DustBackground />
      <AnimatedBackground />
      <div className="relative h-screen">
        <GoButton
          style={{
            top: `${topOffset}px`,
            left: `${leftOffset}px`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          onClick={() => console.log("Party started!")}
        />
      </div>
      <EditorWindow
        lines={[
          "Hello, world!", 
          "Programming Party is all about having fun while learning to code!",
          "",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod",
          "tempor incididunt ut labore et dolore magna aliqua."
        ]}
        title="welcome.tsx"
        style={{
          position: "absolute",
          top: `${topOffset + dynamicFontSize * 3}px`,
          left: `50%`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
};

export default HeroCanvas;
