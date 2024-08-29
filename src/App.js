import React, {useState, useEffect} from 'react';
import {
    ChakraProvider,
    Box,
    VStack,
    Heading,
    Container,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription
} from '@chakra-ui/react';
import io from 'socket.io-client';
import Login from './components/Login';
import RoomList from './components/RoomList';
import GameRoom from './components/GameRoom';
import {extendTheme} from "@chakra-ui/react";

const theme = extendTheme({
    fonts: {
        heading: "'Roboto', sans-serif",
        body: "'Roboto', sans-serif",
    },
    colors: {
        brand: {
            50: "#E6FFFA",
            100: "#B2F5EA",
            500: "#319795",
            900: "#234E52",
        },
    },
});

const socket = io('http://localhost:5001', {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
});

function App() {
    const [playerName, setPlayerName] = useState('');
    const [currentRoom, setCurrentRoom] = useState(null);
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
        };
    }, []);

    const handleLogin = (name) => {
        setPlayerName(name);
        console.log('Logged in as:', name);
    };

    const handleJoinRoom = (roomName) => {
        console.log('Attempting to join room:', roomName);
        socket.emit('joinRoom', roomName, playerName);
        setCurrentRoom(roomName);
    };

    const handleLeaveRoom = () => {
        console.log('Leaving room:', currentRoom);
        socket.emit('leaveRoom', currentRoom);
        setCurrentRoom(null);
        socket.emit('getRoomList');
    };

    const handleLogout = () => {
        console.log('User logged out');
        setPlayerName('');
        setCurrentRoom(null);
        socket.disconnect();

        setTimeout(() => {
            socket.connect(); // Volver a conectar el socket
        }, 100);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box minHeight="100vh" bg="gray.50">
                <Container maxWidth="container.xl" centerContent py={8}>
                    <VStack spacing={8}>
                        <Heading as="h1" size="2xl" color="brand.500">Connect 4</Heading>
                        {!isConnected && (
                            <Alert status="error">
                                <AlertIcon/>
                                <AlertTitle mr={2}>Disconnected from server</AlertTitle>
                                <AlertDescription>Please check your internet connection.</AlertDescription>
                            </Alert>
                        )}
                        {!playerName && <Login onLogin={handleLogin}/>}
                        {playerName && !currentRoom && (
                            <RoomList socket={socket} onJoinRoom={handleJoinRoom} playerName={playerName}
                                      onLogout={handleLogout}/>
                        )}
                        {playerName && currentRoom && (
                            <GameRoom
                                socket={socket}
                                roomName={currentRoom}
                                playerName={playerName}
                                onLeaveRoom={handleLeaveRoom}
                            />
                        )}
                    </VStack>
                </Container>
            </Box>
        </ChakraProvider>
    );
}

export default App;