import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, Flex, Button, Heading, Grid, Alert, AlertIcon, AlertTitle, AlertDescription, Icon } from '@chakra-ui/react';
import { MdLogout } from 'react-icons/md'
import Connect4Board from './Connect4Board';

const GameRoom = ({ socket, roomName, playerName, onLeaveRoom }) => {
    const [roomData, setRoomData] = useState(null);// Declara el estado 'roomData' con un valor inicial de 'null'.
    const [gameOver, setGameOver] = useState(null);// Declara el estado 'gameOver' con un valor inicial de 'null'.

    useEffect(() => {// Escucha los eventos 'roomUpdate', 'gameUpdate' y 'gameOver' y actualiza el estado 'roomData' y 'gameOver' con los datos recibidos.
        socket.on('roomUpdate', (data) => {
            setRoomData(data);
        });

        socket.on('gameUpdate', (game) => {
            setRoomData((prevData) => ({ ...prevData, game }));
        });

        socket.on('gameOver', (result) => {
            setGameOver(result);
        });

        return () => {// Cancela los eventos 'roomUpdate', 'gameUpdate' y 'gameOver' cuando el componente se desmonta.
            socket.off('roomUpdate');
            socket.off('gameUpdate');
            socket.off('gameOver');
        };
    }, [socket]);

    const makeMove = (column) => {// Función para realizar un movimiento.
        if (roomData && roomData.game.currentPlayer === roomData.players.findIndex(p => p.name === playerName)) {// Verifica si el jugador actual es el que realiza el movimiento.
            socket.emit('makeMove', roomName, column);// Emite el evento 'makeMove' al servidor.
        }
    };

    if (!roomData) {
        return <Text>Loading...</Text>;
    }

    const isPlayer = roomData.players.some(p => p.name === playerName);// Verifica si el jugador actual es el que realiza el movimiento.
    const currentPlayerName = roomData.players[roomData.game.currentPlayer]?.name;// Obtiene el nombre del jugador actual.

    return (
        // Contenedor principal de la sala de juego.
        <Box maxWidth="700px" margin="auto" mt={8} p={6} borderRadius="xl" boxShadow="xl" bg="white">
            <VStack spacing={6} align="stretch">
                <Flex justifyContent="space-between" alignItems="center">
                    <Heading fontSize="2xl" color="brand.500">Room: {roomName}</Heading>
                    <Button onClick={onLeaveRoom} colorScheme="red" size="sm" leftIcon={<Icon as={MdLogout} />}>
                        Leave Room
                    </Button>
                </Flex>
                {/* Grid con dos columnas, una para jugadores y otra para espectadores */}
                <Grid templateColumns="1fr 1fr" gap={4}>
                    <Box>
                        <Text fontWeight="bold">Players:</Text>
                        <Text>{roomData.players.map(p => p.name).join(', ')}</Text>
                    </Box>
                    <Box>
                        <Text fontWeight="bold">Spectators:</Text>
                        <Text>{roomData.spectators.map(s => s.name).join(', ')}</Text>
                    </Box>
                </Grid>
                {/* Si el juego ha terminado, muestra un mensaje */}
                {gameOver ? (
                    <Alert status="success" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
                        <AlertIcon boxSize="40px" mr={0} />
                        <AlertTitle mt={4} mb={1} fontSize="lg">
                            Game Over!
                        </AlertTitle>
                        <AlertDescription maxWidth="sm">
                            {gameOver}
                        </AlertDescription>
                    </Alert>
                ) : (
                    // Si el juego no ha terminado, muestra el jugador actual
                    <Box textAlign="center" p={4} bg="brand.50" borderRadius="md">
                        <Text fontSize="xl" fontWeight="bold">
                            Current player: {currentPlayerName}
                            {currentPlayerName === playerName && " (You)"}
                        </Text>
                    </Box>
                )}
                {/* Componente Connect4Board que muestra el tablero del juego */}
                <Connect4Board
                    board={roomData.game.board}
                    onColumnClick={makeMove}
                    currentPlayer={isPlayer ? roomData.game.currentPlayer : null}
                />
                {/* Si el usuario es un espectador, muestra un mensaje */}
                {!isPlayer && (
                    <Box textAlign="center" p={4} bg="gray.100" borderRadius="md">
                        <Text fontSize="lg" fontWeight="bold">
                            You are a spectator
                        </Text>
                    </Box>
                )}
            </VStack>
        </Box>
    );
};

export default GameRoom;