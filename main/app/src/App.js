import logo from './logo.svg';
import './App.css';
import useMouseMovement from './hooks/useMouseMovement';
import { getHomePageData } from './services/getData';
import { useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
function App() {

    const movements = useMouseMovement();
    const { socket, connected } = useSocket("http://localhost:8000/");
    useEffect(() => {
        getHomePageData("http://localhost:8000/").then(data => {
            console.log(data);
        })
    }, [])

    useEffect(() => {
        if (socket && connected) {
            //listen for data 

            socket.on("mouse-movement", (data) => {
                console.log(data);
            })


            //send data
            socket.emit("mouse-movement", movements);
        }

    }, [socket, connected, movements])
    return (
        <div >
        </div>
    );
}

export default App;
