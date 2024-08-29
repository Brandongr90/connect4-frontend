import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, HStack, Button } from '@chakra-ui/react';
import Connect4Board from './Connect4Board';

const GameRoom = ({ socket, roomName, playerName, onLeaveRoom }) => {
    const [roomData, setRoomData] = useState(null);
    const [gameOver, setGameOver] = useState(null);

    useEffect(() => {
        socket.on('roomUpdate', (data) => {
            setRoomData(data);
        });

        socket.on('gameUpdate', (game) => {
            setRoomData((prevData) => ({ ...prevData, game }));
        });

        socket.on('gameOver', (result) => {
            setGameOver(result);
        });

        return () => {
            socket.off('roomUpdate');
            socket.off('gameUpdate');
            socket.off('gameOver');
        };
    }, [socket]);

    const makeMove = (column) => {
        if (roomData && roomData.game.currentPlayer === roomData.players.findIndex(p => p.name === playerName)) {
            socket.emit('makeMove', roomName, column);
        }
    };

    if (!roomData) {
        return <Text>Loading...</Text>;
    }

    const isPlayer = roomData.players.some(p => p.name === playerName);
    const currentPlayerName = roomData.players[roomData.game.currentPlayer]?.name;

    return (
        <Box maxWidth="600px" margin="auto" mt={8}>
            <VStack spacing={4} align="stretch">
                <HStack justifyContent="space-between">
                    <Text fontSize="xl" fontWeight="bold">
                        Room: {roomName}
                    </Text>
                    <Button onClick={onLeaveRoom} colorScheme="red" size="sm">
                        Leave Room
                    </Button>
                </HStack>
                <HStack justifyContent="space-between">
                    <Text>Players: {roomData.players.map(p => p.name).join(', ')}</Text>
                    <Text>Spectators: {roomData.spectators.map(s => s.name).join(', ')}</Text>
                </HStack>
                {gameOver ? (
                    <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                        {gameOver}
                    </Text>
                ) : (
                    <Text fontSize="xl" textAlign="center">
                        Current player: {currentPlayerName}
                        {currentPlayerName === playerName && " (You)"}
                    </Text>
                )}
                <Connect4Board
                    board={roomData.game.board}
                    onColumnClick={makeMove}
                    currentPlayer={isPlayer ? roomData.game.currentPlayer : null}
                />
                {!isPlayer && (
                    <Text fontSize="lg" textAlign="center">
                        You are a spectator
                    </Text>
                )}
            </VStack>
        </Box>
    );
};

export default GameRoom;