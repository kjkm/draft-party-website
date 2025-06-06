import { useEffect } from "react";
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
  useEffect(() => {
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
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
            className="fixed top-[60%] left-[50%] -translate-x-1/2 -translate-y-1/2"
            onClick={() => console.log("Party started!")}
          />
        </div>
      </div>
    </>
  );
}

export default App;
