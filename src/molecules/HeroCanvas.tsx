import React, { useEffect, useState } from "react";
import AnimatedBackground from "./atoms/AnimatedBackground";
import GoButton from "./atoms/particles/GoButton";

const HeroCanvas: React.FC = () => {
  const [topOffset, setTopOffset] = useState(0);
  const [leftOffset, setLeftOffset] = useState(0);

  useEffect(() => {
    // Function to update go button offsets based on window size
    // This is because the button overlays on top of the rendered canvas text.
    const updateOffsets = () => {
      const dynamicFontSize = Math.min(window.innerWidth / 10, 104);

      const numLines = 3;

      const textStartingPoint = 0.38 * window.innerHeight;
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
      {/* Pink Parallax Background */}
      <AnimatedBackground
        textContent=""
        lavaColor="#f7b5ff"
        clusterCount={20}
        wandererCount={5}
        clusterConfig={{
          speed: 0.3,
          xAmplitude: 0.03,
          baseY: 0.1,
          yAmplitude: 0.05,
          sizeBase: 0.05,
          sizeAmplitude: 0.03,
        }}
        wandererConfig={{
          speed: 0.08,
          xAmplitude: 0.45,
          yAmplitude: 0.45,
          baseSize: 0.2,
          sizeAmplitude: 0.05,
        }}
      />
      {/* Bubbles Midground */}
      <AnimatedBackground
        textContent=""
        lavaColor="#ffffff"
        clusterCount={0}
        wandererCount={50}
        clusterConfig={{
          speed: 0.3,
          xAmplitude: 0.03,
          baseY: 0.1,
          yAmplitude: 0.05,
          sizeBase: 0.005,
          sizeAmplitude: 0.005,
        }}
        wandererConfig={{
          speed: 0.16,
          xAmplitude: 0.65,
          yAmplitude: 0.65,
          baseSize: 0.01,
          sizeAmplitude: 0.01,
        }}
      />
      {/* Green Foreground + Text */}
      <AnimatedBackground 
        textContent={"PRO.\nGRAMMING.\nPARTY!"} 
        lavaColor="#bad4aa"
        clusterCount={20}
        wandererCount={3}
        clusterConfig={{
          speed: 0.3,
          xAmplitude: 0.03,
          baseY: 0.1,
          yAmplitude: 0.05,
          sizeBase: 0.05,
          sizeAmplitude: 0.03,
        }}
        wandererConfig={{
          speed: 0.2,
          xAmplitude: 0.45,
          yAmplitude: 0.45,
          baseSize: 0.12,
          sizeAmplitude: 0.05,
        }}
      />
      {/* Go Button */}
      <div className="absolute inset-0 w-full h-[85vh]">
        <GoButton
          style={{
            top: `${topOffset}px`,
            left: `${leftOffset}px`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          onClick={() => console.log("Party started!")}
        />
      </div>
    </>
  );
};

export default HeroCanvas;
