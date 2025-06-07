import React from "react";
import HeroCanvas from "./atoms/HeroCanvas";
import PageContainer from "./atoms/particles/PageContainer";
import EditorWindow from "./atoms/particles/EditorWindow";

const HomePage: React.FC = () => {
  return (
    <div className="h-screen bg-sunshine overflow-x-hidden">
      <HeroCanvas />
      <PageContainer>
        <EditorWindow
          lines={[
            "Hello, world!",
            "Programming Party is all about having fun while learning to code!",
            "",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          ]}
          title="welcome.tsx"
          style={{ position: "absolute", top: "20vh", left: "10vw" }}
        />
      </PageContainer>
    </div>
  );
};

export default HomePage;
