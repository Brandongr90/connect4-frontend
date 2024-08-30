import React, { useState, useEffect } from 'react';
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
import { extendTheme } from "@chakra-ui/react";

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
// Inicializa el cliente de Socket.IO para conectar con el servidor en el puerto 5001
const socket = io('http://localhost:5001', {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
});

function App() {
    // Estado para almacenar el nombre del jugador
    const [playerName, setPlayerName] = useState('');
    // Estado para almacenar el nombre de la sala actual
    const [currentRoom, setCurrentRoom] = useState(null);
    // Estado para verificar si el socket está conectado
    const [isConnected, setIsConnected] = useState(socket.connected);

    // Efecto para manejar la conexión y desconexión del socket
    useEffect(() => {
        // Maneja el evento de conexión
        socket.on('connect', () => {
            console.log('Connected to server');
            setIsConnected(true);
        });
        // Maneja el evento de desconexión
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        });
        // Maneja el evento de error de conexión
        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        // Limpia los eventos del socket al desmontar el componente
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
        };
    }, []);
 // Función para manejar el inicio de sesión del jugador
    const handleLogin = (name) => {
        setPlayerName(name);
        console.log('Logged in as:', name);
    };
// Función para manejar la unión a una sala
    const handleJoinRoom = (roomName) => {
        console.log('Attempting to join room:', roomName);
        socket.emit('joinRoom', roomName, playerName);
        setCurrentRoom(roomName);
    };
// Función para manejar la salida de una sala
    const handleLeaveRoom = () => {
        console.log('Leaving room:', currentRoom);
        socket.emit('leaveRoom', currentRoom);
        setCurrentRoom(null);
        socket.emit('getRoomList');
    };
   // Función para manejar el cierre de sesión
    const handleLogout = () => {
        console.log('User logged out');
        setPlayerName('');
        setCurrentRoom(null);
        socket.disconnect();
// Reconexion del socket después de un breve retraso
        setTimeout(() => {
            socket.connect(); // Volver a conectar el socket
        }, 100);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box minHeight="100vh" bg="gray.50">
                <Container maxWidth="container.xl" centerContent py={8}>
                    <VStack spacing={8}>
                        {/* Título principal de la aplicación */}
                        <Heading as="h1" size="2xl" color="brand.500">Connect 4</Heading>
                        
                        {/* Mensaje de alerta si no hay conexión con el servidor */}
                        {!isConnected && (
                            <Alert status="error">
                                <AlertIcon />
                                <AlertTitle mr={2}>Disconnected from server</AlertTitle>
                                <AlertDescription>Please check your internet connection.</AlertDescription>
                            </Alert>
                        )}
                        
                        {/* Componente de inicio de sesión si no hay nombre de jugador */}
                        {!playerName && <Login onLogin={handleLogin} />}
                        
                        {/* Componente de lista de salas si hay un nombre de jugador pero no hay sala actual */}
                        {playerName && !currentRoom && (
                            <RoomList socket={socket} onJoinRoom={handleJoinRoom} playerName={playerName}
                                onLogout={handleLogout} />
                        )}
                        
                        {/* Componente de sala de juego si hay un nombre de jugador y una sala actual */}
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