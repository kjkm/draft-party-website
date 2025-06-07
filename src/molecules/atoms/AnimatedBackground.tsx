import React, { useEffect, useRef } from "react";
import { startLavaLamp } from "./LavaLampCanvas";
import type {
  ClusterConfig,
  WandererConfig,
  TextConfig,
} from "./LavaLampCanvas";
import { hexToRGBA } from "./particles/ColorUtils";

const AnimatedBackground: React.FC = () => {
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
      const lavaColor = hexToRGBA("#bad4aa");
      const backgroundColor = hexToRGBA("#000000", 0);

      const clusterConfig: ClusterConfig = {
        speed: 0.3,
        xAmplitude: 0.03,
        baseY: 0.1,
        yAmplitude: 0.05,
        sizeBase: 0.05,
        sizeAmplitude: 0.03,
      };

      const wandererConfig: WandererConfig = {
        speed: 0.2,
        xAmplitude: 0.45,
        yAmplitude: 0.45,
        baseSize: 0.12,
        sizeAmplitude: 0.05,
      };

      const textConfig: TextConfig = {
        content: "PRO.\nGRAMMING.\nPARTY!",
        font: "oswald",
        color: "#000000",
        featureColor: "#e8871e",
        textAlign: "left",
        fontSize: dynamicFontSize,
        textPosition: [0.25, 0.4],
      };

      startLavaLamp(
        canvas,
        lavaColor,
        backgroundColor,
        20,
        3,
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

export default AnimatedBackground;
