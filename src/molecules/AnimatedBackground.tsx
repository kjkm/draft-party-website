import React, {useEffect, useRef} from "react";
import { startLavaLamp } from "./atoms/LavaLampCanvas";

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

        document.fonts.load('700 48px Oswald').then(() => {
            startLavaLamp(canvas);
        });
        
        return () => {
            window.removeEventListener("resize", resize);
        };

    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
        />
    );
};

export default AnimatedBackground;