import { useEffect, useState } from "react";
import { confetti } from "@tsparticles/confetti";
import AnimatedBackground from "./molecules/AnimatedBackground";
import TopMenu from "./molecules/TopMenu";
import ParallaxBackground from "./molecules/ParallaxBackground";
import DustBackground from "./molecules/DustBackground";
import GoButton from "./molecules/atoms/particles/GoButton";

const handleClick = (e: MouseEvent) => {
  confetti("tsparticles", {
    count: 100,
    spread: 360,
    startVelocity: 30,
    decay: 0.9,
    gravity: 0.5,
    origin: {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    },
  });
};

function App() {
  const [topOffset, setTopOffset] = useState(0);
  const [leftOffset, setLeftOffset] = useState(0);

  useEffect(() => {
    const updateOffsets = () => {
      const dynamicFontSize = Math.min(window.innerWidth / 10, 104);
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

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <div className="h-screen bg-sunshine overflow-hidden">
        <TopMenu />
        <ParallaxBackground />
        <DustBackground />
        <AnimatedBackground />
        <div className="relative h-screen">
          <GoButton
            style={{
              top: `${topOffset}px`,
              left: `${leftOffset}px`,
            }}
            className="fixed -translate-x-1/2 -translate-y-1/2"
            onClick={() => console.log("Party started!")}
          />
        </div>
      </div>
    </>
  );
}

export default App;
