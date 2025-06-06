import { useEffect } from "react";
import { confetti } from "@tsparticles/confetti";
import TopMenu from "./molecules/atoms/TopMenu";
import HomePage from "./molecules/HomePage";

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
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <TopMenu />
      <HomePage />
    </>
  );
}

export default App;
