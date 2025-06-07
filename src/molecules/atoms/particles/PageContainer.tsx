import React from "react";

type PageContainerProps = {
  children: React.ReactNode;
};

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="mt-[-100px] w-full top-[82vh] absolute flex flex-col items-center justify-start min-h-screen bg-malachite text-white overflow-x-hidden">
      <div className="flex flex-col items-center justify-start">{children}</div>
    </div>
  );
};

export default PageContainer;
