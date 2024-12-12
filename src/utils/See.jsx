export const See = ({ className = "w-full h-full" }) => (
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
            {/* Eye Outline */}
            <ellipse cx="100" cy="100" rx="90" ry="55" fill="#c0c0c0" stroke="#444" strokeWidth="3" />

            {/* Iris */}
            <circle cx="100" cy="100" r="30" fill="#4B0082" stroke="#6A5ACD" strokeWidth="2" />

            {/* Pupil */}
            <circle cx="100" cy="100" r="15" fill="#000" />

            {/* Pupil Highlight */}
            <circle cx="110" cy="90" r="5" fill="rgba(255, 255, 255, 0.8)" />

            {/* Eyelashes */}
            <line x1="30" y1="80" x2="70" y2="60" stroke="#444" strokeWidth="2" />
            <line x1="130" y1="60" x2="170" y2="80" stroke="#444" strokeWidth="2" />
            <line x1="50" y1="90" x2="80" y2="70" stroke="#444" strokeWidth="2" />
            <line x1="120" y1="70" x2="150" y2="90" stroke="#444" strokeWidth="2" />

            {/* Upper Eyelid for Blinking */}
            <ellipse id="upper-eyelid" cx="100" cy="85" rx="90" ry="50" fill="#c0c0c0" style={{
                    transformOrigin: 'center',
                    animation: 'blink 5s infinite'
            }} />

            {/* Lower Eyelid */}
            <ellipse cx="100" cy="115" rx="90" ry="50" fill="#c0c0c0" />

            <style jsx>{`
            @keyframes blink {
                0%, 90% {
                    transform: translateY(0);
                }
                92%, 98% {
                    transform: translateY(30px);
                }
            }
        `}</style>
    </svg>
);
