import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, VStack, Heading, Text } from '@chakra-ui/react';
import io from 'socket.io-client';
import Login from './components/Login';
import RoomList from './components/RoomList';
import GameRoom from './components/GameRoom';

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
  };

  return (
      <ChakraProvider>
        <Box textAlign="center" fontSize="xl">
          <VStack spacing={8} p={8}>
            <Heading>Connect 4 Online</Heading>
            {!isConnected && <Text color="red.500">Disconnected from server</Text>}
            {!playerName && <Login onLogin={handleLogin} />}
            {playerName && !currentRoom && (
                <RoomList socket={socket} onJoinRoom={handleJoinRoom} playerName={playerName} />
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
        </Box>
      </ChakraProvider>
  );
}

export default App;