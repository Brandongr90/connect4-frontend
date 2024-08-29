import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, Flex, Button, Heading, Grid, Alert, AlertIcon, AlertTitle, AlertDescription, Icon } from '@chakra-ui/react';
import { MdLogout } from 'react-icons/md'
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
        <Box maxWidth="700px" margin="auto" mt={8} p={6} borderRadius="xl" boxShadow="xl" bg="white">
            <VStack spacing={6} align="stretch">
                <Flex justifyContent="space-between" alignItems="center">
                    <Heading fontSize="2xl" color="brand.500">Room: {roomName}</Heading>
                    <Button onClick={onLeaveRoom} colorScheme="red" size="sm" leftIcon={<Icon as={MdLogout} />}>
                        Leave Room
                    </Button>
                </Flex>
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
                    <Box textAlign="center" p={4} bg="brand.50" borderRadius="md">
                        <Text fontSize="xl" fontWeight="bold">
                            Current player: {currentPlayerName}
                            {currentPlayerName === playerName && " (You)"}
                        </Text>
                    </Box>
                )}
                <Connect4Board
                    board={roomData.game.board}
                    onColumnClick={makeMove}
                    currentPlayer={isPlayer ? roomData.game.currentPlayer : null}
                />
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