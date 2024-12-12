import React, { useState, useEffect } from 'react';

const AnimatedMonitoringSVG = () => {
    const [alertActive, setAlertActive] = useState(false);

    useEffect(() => {
        const alertInterval = setInterval(() => {
            setAlertActive(prev => !prev);
        }, 3000);

        return () => clearInterval(alertInterval);
    }, []);

    return (
        <svg width="500" height="500" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="graphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00ff00" stopOpacity="1"/>
                    <stop offset="100%" stopColor="#00ff00" stopOpacity="0.2"/>
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Pure black background */}
            <rect width="400" height="300" fill="#000000" />

            {/* Animated graph */}
            <g filter="url(#glow)">
                <path d="M75,200 Q125,100 175,180 T275,120 T375,160" fill="none" stroke="url(#graphGradient)" strokeWidth="3">
                    <animate
                        attributeName="d"
                        dur="10s"
                        repeatCount="indefinite"
                        values="
              M75,200 Q125,100 175,180 T275,120 T375,160;
              M75,180 Q125,220 175,100 T275,180 T375,120;
              M75,150 Q125,80 175,220 T275,100 T375,180;
              M75,200 Q125,100 175,180 T275,120 T375,160"
                    />
                </path>
            </g>

            {/* Pulsing data points */}
            {[75, 175, 275].map((cx, index) => (
                <circle key={index} cx={cx} cy="150" r="5" fill="#00ff00" filter="url(#glow)">
                    <animate
                        attributeName="r"
                        values="4;7;4"
                        dur="2s"
                        repeatCount="indefinite"
                        begin={`${index * 0.5}s`}
                    />
                    <animate
                        attributeName="opacity"
                        values="1;0.5;1"
                        dur="2s"
                        repeatCount="indefinite"
                        begin={`${index * 0.5}s`}
                    />
                </circle>
            ))}

            {/* Floating particles */}
            {[1, 2, 3, 4, 5].map((_, index) => (
                <circle key={index} r="2" fill="#00ff00" opacity="0.5">
                    <animate
                        attributeName="cx"
                        values="0;400"
                        dur={`${10 + index * 2}s`}
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="cy"
                        values={`${50 + index * 50};${100 + index * 30};${50 + index * 50}`}
                        dur={`${10 + index * 2}s`}
                        repeatCount="indefinite"
                    />
                </circle>
            ))}
        </svg>
    );
};

export default AnimatedMonitoringSVG;
