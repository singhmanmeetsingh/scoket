import logo from './logo.svg';
import './App.css';
import useMouseMovement from './hooks/useMouseMovement';
import { getHomePageData } from './services/getData';
import { useEffect } from 'react';
function App() {

    const movements = useMouseMovement();

    useEffect(() => {
        getHomePageData("http://localhost:8000/").then(data => {
            console.log(data);
        })
    }, [])
    return (
        <div >
        </div>
    );
}

export default App;
