import React from 'react';

const AnimatedEventFlowLogo = () => {
    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', isolation: 'isolate' }}>
            <style>
                {`
                .aefl-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }
                .aefl-wrapper:hover {
                    transform: scale(1.02);
                }

                .aefl-layer {
                    position: absolute;
                    z-index: -1;
                    overflow: hidden;
                    border-radius: 0.75rem;
                }
                
                .aefl-layer::before {
                    content: '';
                    position: absolute;
                    z-index: -2;
                    width: 700px;
                    height: 700px;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: aefl-spin linear infinite;
                }

                @keyframes aefl-spin {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }

                @keyframes aefl-spin-reverse {
                    from { transform: translate(-50%, -50%) rotate(360deg); }
                    to { transform: translate(-50%, -50%) rotate(0deg); }
                }
                
                .aefl-layer-1 { top: -7px; bottom: -7px; left: -7px; right: -7px; filter: blur(3px); }
                .aefl-layer-1::before {
                    width: 1000px; height: 1000px;
                    background: conic-gradient(#000, #402fb5 5%, #000 38%, #000 50%, #cf30aa 60%, #000 87%);
                    animation-duration: 4s;
                }

                .aefl-layer-2-1, .aefl-layer-2-2, .aefl-layer-2-3 { top: -5px; bottom: -5px; left: -5px; right: -5px; filter: blur(3px); }
                .aefl-layer-2-1::before, .aefl-layer-2-2::before, .aefl-layer-2-3::before {
                    background: conic-gradient(rgba(0,0,0,0), #18116a, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 50%, #6e1b60, rgba(0,0,0,0) 60%);
                    animation-duration: 4s;
                }
                .aefl-layer-2-1::before { animation-delay: -1s; }
                .aefl-layer-2-2::before { animation-delay: -2s; }

                .aefl-layer-3 { top: -3px; bottom: -3px; left: -3px; right: -3px; border-radius: 0.5rem; filter: blur(2px); }
                .aefl-layer-3::before {
                    background: conic-gradient(rgba(0,0,0,0) 0%, #a099d8, rgba(0,0,0,0) 8%, rgba(0,0,0,0) 50%, #dfa2da, rgba(0,0,0,0) 58%);
                    filter: brightness(0.7);
                    animation-duration: 3.5s;
                    animation-name: aefl-spin-reverse;
                }

                .aefl-layer-4 { top: -1.5px; bottom: -1.5px; left: -1.5px; right: -1.5px; filter: blur(0.5px); }
                .aefl-layer-4::before {
                    background: conic-gradient(#1c191c, #402fb5 5%, #1c191c 14%, #1c191c 50%, #cf30aa 60%, #1c191c 64%);
                    filter: brightness(0.65);
                    animation-duration: 5s;
                }

                .aefl-main {
                    position: relative;
                    background-color: #010201;
                    padding: 0.4rem 1.2rem;
                    width: max-content;
                    border-radius: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: sans-serif;
                    font-size: 1.4rem;
                    font-weight: 800;
                    color: white;
                    letter-spacing: -0.02em;
                    box-shadow: 0 0 10px rgba(255,255,255,0.2);
                    transition: box-shadow 0.3s ease;
                }
                .aefl-wrapper:hover .aefl-main {
                    box-shadow: 0 0 20px rgba(255,255,255,0.6);
                }

                .aefl-pink-mask {
                    pointer-events: none;
                    width: 30px;
                    height: 20px;
                    position: absolute;
                    background-color: #cf30aa;
                    top: 50%;
                    left: 15px;
                    transform: translateY(-50%);
                    filter: blur(20px);
                    opacity: 0.4;
                    transition: opacity 0.5s ease;
                }
                .aefl-wrapper:hover .aefl-pink-mask {
                    opacity: 0;
                }
                `}
            </style>

            <div className="aefl-wrapper">
                <div className="aefl-layer aefl-layer-1"></div>
                <div className="aefl-layer aefl-layer-2-1"></div>
                <div className="aefl-layer aefl-layer-2-2"></div>
                <div className="aefl-layer aefl-layer-2-3"></div>
                <div className="aefl-layer aefl-layer-3"></div>
                <div className="aefl-layer aefl-layer-4"></div>

                <div className="aefl-main">
                    EventFlow
                    <div className="aefl-pink-mask"></div>
                </div>
            </div>
        </div>
    );
};

export default AnimatedEventFlowLogo;
