import React, { useState } from 'react';
import { Box, Button, Input, VStack } from '@chakra-ui/react';

const Login = ({ onLogin }) => {
    const [nickname, setNickname] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nickname.trim()) {
            onLogin(nickname);
        }
    };

    return (
        <Box maxWidth="400px" margin="auto" mt={8}>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <Input
                        placeholder="Enter your nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <Button type="submit" colorScheme="blue" width="full">
                        Enter
                    </Button>
                </VStack>
            </form>
        </Box>
    );
};

export default Login;