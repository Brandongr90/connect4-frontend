import React, {useState, useEffect} from 'react';
import {
    Box,
    Button,
    Input,
    VStack,
    List,
    ListItem,
    Heading,
    InputGroup,
    InputRightElement,
    useColorModeValue,
    Text,
    Icon,
    Flex,
    HStack,
    Divider
} from '@chakra-ui/react';
import {MdEmojiPeople, MdDoorSliding, MdLogout} from 'react-icons/md'

const RoomList = ({socket, onJoinRoom, playerName, onLogout}) => {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        socket.emit('getRoomList');
        socket.emit('newPlayer', playerName);

        socket.on('roomList', (roomList) => {
            console.log('Received room list:', roomList);
            setRooms(roomList);
        });

        socket.on('playerList', (playerList) => {
            setPlayers(playerList);
        });

        return () => {
            socket.off('roomList');
            socket.off('playerList');
        };
    }, [socket, playerName]);

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

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    return (
        <Box maxWidth="900px" margin="auto" mt={8} p={6} borderRadius="xl" boxShadow="xl" bg={bgColor}>
            <Heading mb={6} textAlign="center" color="brand.500">Game Lobby</Heading>
            <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
                <Box flex={1}>
                    <Heading size="md" mb={4}>
                        <Icon as={MdDoorSliding} mr={2} />
                        Available Rooms
                    </Heading>
                    <VStack spacing={4} align="stretch">
                        <HStack>
                            <Input
                                placeholder="New room name"
                                value={newRoomName}
                                onChange={(e) => setNewRoomName(e.target.value)}
                                borderColor="brand.100"
                                _hover={{ borderColor: 'brand.500' }}
                                _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #319795' }}
                            />
                            <Button onClick={createRoom} colorScheme="teal">
                                Create
                            </Button>
                        </HStack>
                        <List spacing={3} width="full" overflowY="auto" maxHeight="300px">
                            {rooms.map((room) => (
                                <ListItem key={room}>
                                    <Button
                                        onClick={() => onJoinRoom(room)}
                                        width="full"
                                        justifyContent="space-between"
                                        colorScheme="teal"
                                        variant="outline"
                                        _hover={{ bg: 'brand.50' }}
                                    >
                                        <Text>{room}</Text>
                                        <Text fontSize="sm">Join</Text>
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </VStack>
                </Box>

                <Divider orientation="vertical" />

                <VStack flex={1} align="stretch">
                    <Box>
                        <Heading size="md" mb={4}>
                            <Icon as={MdEmojiPeople} mr={2} />
                            Connected Players
                        </Heading>
                        <List spacing={2} overflowY="auto" maxHeight="300px">
                            {players.map((player) => (
                                <ListItem key={player} p={2} borderRadius="md" bg="brand.50">
                                    <Text>{player}</Text>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Button
                        onClick={onLogout}
                        colorScheme="red"
                        width="full"
                        mt={4}
                        leftIcon={<Icon as={MdLogout} />}
                    >
                        Logout
                    </Button>
                </VStack>
            </Flex>
        </Box>


    );
};

export default RoomList;