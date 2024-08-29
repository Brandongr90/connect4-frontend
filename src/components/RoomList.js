import React, { useState, useEffect } from 'react';
import { Box, Button, Input, VStack, List, ListItem } from '@chakra-ui/react';

const RoomList = ({ socket, onJoinRoom, playerName }) => {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');

    useEffect(() => {
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
            setNewRoomName('');
        }
    };

    return (
        <Box maxWidth="400px" margin="auto" mt={8}>
            <VStack spacing={4}>
                <Input
                    placeholder="New room name"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                />
                <Button onClick={createRoom} colorScheme="green" width="full">
                    Create Room
                </Button>
                <List spacing={3} width="full">
                    {rooms.map((room) => (
                        <ListItem key={room}>
                            <Button onClick={() => onJoinRoom(room)} width="full">
                                Join {room}
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </VStack>
        </Box>
    );
};

export default RoomList;