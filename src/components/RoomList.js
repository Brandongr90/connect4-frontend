import React, { useState, useEffect } from 'react';
import { Box, Button, Input, VStack, List, ListItem, Heading, InputGroup, InputRightElement, Text, Icon } from '@chakra-ui/react';
import { MdArrowForwardIos } from 'react-icons/md'

const RoomList = ({ socket, onJoinRoom, playerName }) => {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');

    useEffect(() => {
        socket.emit('getRoomList');

        socket.on('roomList', (roomList) => {
            console.log('Received room list:', roomList);
            setRooms(roomList);
        });

        return () => {
            socket.off('roomList');
        };
    }, [socket]);

    const createRoom = () => {
        if (newRoomName.trim()) {
            console.log('Attempting to create room:', newRoomName);
            socket.emit('createRoom', newRoomName, playerName);
            // setNewRoomName('');

            socket.on('roomCreated', (roomName) => {
                console.log('Room created successfully:', roomName);
                onJoinRoom(roomName); // Redirigir al jugador a la sala creada
                setNewRoomName('');
            });
        }
    };

    return (
        <Box maxWidth="500px" margin="auto" mt={16} p={8} borderRadius="xl" boxShadow="xl" bg="white">
            <Heading mb={6} textAlign="center" color="brand.500">Game Rooms</Heading>
            <VStack spacing={6}>
                <InputGroup size="lg">
                    <Input
                        placeholder="New room name"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        borderColor="brand.100"
                        _hover={{ borderColor: "brand.500" }}
                        _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px #319795" }}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={createRoom} colorScheme="teal">
                            Create
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <List spacing={3} width="full">
                    {rooms.map((room) => (
                        <ListItem key={room}>
                            <Button
                                onClick={() => onJoinRoom(room)}
                                width="full"
                                colorScheme="teal"
                                variant="outline"
                                justifyContent="space-between"
                                _hover={{ bg: "brand.50" }}
                            >
                                <Text>{room}</Text>
                                <Icon as={MdArrowForwardIos} />
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </VStack>
        </Box>
    );
};

export default RoomList;