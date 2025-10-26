import io from 'socket.io-client';
import { useEffect, useState } from 'react';

//create hook for the sending data 
export const useSocket = (url, options = {}) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);


    useEffect(() => {

        const newSocket = io(url, options);
        setSocket(newSocket);


        newSocket.on('connect', () => {
            setConnected(true);
            console.log("connected");
        });


        newSocket.on('disconnect', () => {
            setConnected(false);
            console.log("disconnected");
        });

        setSocket(newSocket)


        return () => newSocket.close();




    }, [url])



    return { socket, connected };

}


