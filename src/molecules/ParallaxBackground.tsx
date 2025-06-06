import React, { useEffect, useRef } from 'react';
import { startLavaLamp } from './atoms/LavaLampCanvas';
import type { ClusterConfig, WandererConfig, TextConfig } from './atoms/LavaLampCanvas';
import { hexToRGBA } from './atoms/particles/ColorUtils';

const ParallaxBackground: React.FC = () => {
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
            const dynamicFontSize = Math.min(canvas.width / 10, 104);
            const lavaColor = hexToRGBA('#f7b5ff');
            const backgroundColor = hexToRGBA('#000000', 0);

            const clusterConfig: ClusterConfig = {
                speed: 0.3,
                xAmplitude: 0.03,
                baseY: 0.1,
                yAmplitude: 0.05,
                sizeBase: 0.05,
                sizeAmplitude: 0.03
            };

            const wandererConfig: WandererConfig = {
                speed: 0.08,
                xAmplitude: 0.45,
                yAmplitude: 0.45,
                baseSize: 0.2,
                sizeAmplitude: 0.05
            };

            const textConfig: TextConfig = {
                content: '',
                font: 'oswald',
                color: '#000000',
                featureColor: '#e8871e',
                textAlign: 'left',
                fontSize: dynamicFontSize,
                textPosition: [0.25, 0.5]
            };

            startLavaLamp(
                canvas,
                lavaColor,
                backgroundColor,
                20,
                5,
                clusterConfig,
                wandererConfig,
                textConfig
            );
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

export default ParallaxBackground;