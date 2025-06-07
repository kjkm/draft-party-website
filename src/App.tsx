import { useEffect } from "react";
import { confetti } from "@tsparticles/confetti";
import TopMenu from "./molecules/TopMenu";
import HeroCanvas from "./molecules/HeroCanvas";
import PageContainer from "./molecules/atoms/particles/PageContainer";
import EditorWindow from "./molecules/atoms/particles/EditorWindow";

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
      <div className="h-screen bg-sunshine overflow-x-hidden">
        <TopMenu />
        <HeroCanvas />
        <PageContainer>
          <EditorWindow lines={[
            "Hello, world!", 
            "Programming Party is all about having fun while learning to code!",
            "",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          ]} title="welcome.tsx" style={{ position: "absolute", top: "20vh", left: "10vw" }} />
        </PageContainer>
      </div>
    </>
  );
}

export default App;
