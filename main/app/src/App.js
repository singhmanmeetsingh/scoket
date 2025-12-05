import './App.css';
import { getHomePageData } from './services/getData';
import { useEffect, useRef, useState } from 'react';
import { useSocket } from './hooks/useSocket';

function App() {
    const isListeningRef = useRef(false);
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const lastPositionRef = useRef({ x: 0, y: 0 });

    const { socket, connected } = useSocket("http://localhost:8000/");

    useEffect(() => {
        getHomePageData("http://localhost:8000/").then(data => {
            console.log(data);
        })
    }, [])

    // Setup listener ONCE
    useEffect(() => {
        if (socket && connected && !isListeningRef.current) {
            console.log("Setting up listener");

            socket.on("user-info", (data) => {
                console.log("RECEIVED user_data", data);

                // Draw other users' movements on canvas
                const { color, user_mouse_movements } = data;
                if (user_mouse_movements && user_mouse_movements.x0 !== undefined) {
                    // Draw line for other users
                    drawLine(
                        user_mouse_movements.x0,
                        user_mouse_movements.y0,
                        user_mouse_movements.x,
                        user_mouse_movements.y,
                        color
                    );
                }
            });

            isListeningRef.current = true;
        }

        return () => {
            if (socket) {
                socket.off("user-info");
            }
        };
    }, [socket, connected])

    const drawLine = (x0, y0, x1, y1, color) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.closePath();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleMouseDown = (e) => {
        setIsDrawing(true);
        const rect = canvasRef.current.getBoundingClientRect();
        lastPositionRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        // Draw line from last position to current
        drawLine(
            lastPositionRef.current.x,
            lastPositionRef.current.y,
            currentX,
            currentY,
            '#000000'
        );

        // Emit to server (only once)
        if (socket && connected) {
            socket.emit("mouse-movement", {
                x0: lastPositionRef.current.x,
                y0: lastPositionRef.current.y,
                x: currentX,
                y: currentY
            });
        }

        // Update last position
        lastPositionRef.current = { x: currentX, y: currentY };
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    return (
        <div style={{
            textAlign: 'center',
            padding: '20px',
            backgroundColor: '#f0f0f0',
            minHeight: '100vh'
        }}>
            <h1>🎨 Collaborative Drawing Canvas</h1>
            <div style={{ marginBottom: '15px' }}>
                <p style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: connected ? 'green' : 'red'
                }}>
                    {connected ? '✅ Connected' : '❌ Disconnected'}
                </p>
                <button
                    onClick={clearCanvas}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    🗑️ Clear Canvas
                </button>
            </div>
            <canvas
                ref={canvasRef}
                width={1200}
                height={700}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                    border: '3px solid #333',
                    cursor: 'crosshair',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
            />
            <p style={{ marginTop: '15px', color: '#666' }}>
                Click and drag to draw. Open multiple tabs to see collaborative drawing!
            </p>
        </div>
    );
}

export default App;
