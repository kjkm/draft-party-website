import React, { useEffect, useRef } from "react";
import { startLavaLamp } from "./LavaLampCanvas";
import type {
  ClusterConfig,
  WandererConfig,
  TextConfig,
} from "./LavaLampCanvas";
import { hexToRGBA } from "./particles/ColorUtils";

const DustBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    document.fonts.load("700 48px Oswald").then(() => {
      const dynamicFontSize = Math.min(canvas.width / 10, 104);
      const lavaColor = hexToRGBA("#ffffff");
      const backgroundColor = hexToRGBA("#000000", 0);

      const clusterConfig: ClusterConfig = {
        speed: 0.3,
        xAmplitude: 0.03,
        baseY: 0.1,
        yAmplitude: 0.05,
        sizeBase: 0.005,
        sizeAmplitude: 0.005,
      };

      const wandererConfig: WandererConfig = {
        speed: 0.16,
        xAmplitude: 0.65,
        yAmplitude: 0.65,
        baseSize: 0.01,
        sizeAmplitude: 0.01,
      };

      const textConfig: TextConfig = {
        content: "",
        font: "oswald",
        color: "#000000",
        featureColor: "#e8871e",
        textAlign: "left",
        fontSize: dynamicFontSize,
        textPosition: [0.25, 0.5],
      };

      startLavaLamp(
        canvas,
        lavaColor,
        backgroundColor,
        0,
        50,
        clusterConfig,
        wandererConfig,
        textConfig
      );
    });

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />;
};

export default DustBackground;
