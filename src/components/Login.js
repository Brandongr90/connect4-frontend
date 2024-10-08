import React, { useState } from 'react';
import { Box, Button, Input, VStack, Heading } from '@chakra-ui/react';

const Login = ({ onLogin }) => {
    const [nickname, setNickname] = useState('');// Declara el estado 'nickname' con un valor inicial vacío

    const handleSubmit = (e) => {// Función para manejar el evento 'submit' del formulario
        e.preventDefault();
        if (nickname.trim()) {// Verifica que el nickname no este vacío
            onLogin(nickname);
        }
    };

    return (
        <Box maxWidth="400px" margin="auto" mt={16} p={8} borderRadius="xl" boxShadow="xl" bg="white">
            <Heading mb={6} textAlign="center" color="brand.500">Choose a Nickname for start to play :)</Heading>
            <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                    <Input
                        placeholder="Enter your nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        size="lg"
                        borderColor="brand.100"
                        _hover={{ borderColor: "brand.500" }}
                        _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px #319795" }}
                    />
                    <Button
                        type="submit"
                        colorScheme="teal"
                        width="full"
                        size="lg"
                        _hover={{ bg: "brand.600" }}
                    >
                        Start Playing
                    </Button>
                </VStack>
            </form>
        </Box>
    );
};

export default Login;