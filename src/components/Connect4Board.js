import React from 'react';
import { Box, SimpleGrid, Circle } from '@chakra-ui/react';

const Connect4Board = ({ board, onColumnClick, currentPlayer }) => {
    return (
        <Box
            bg="blue.500"
            p={4}
            borderRadius="lg"
            width="fit-content"
            margin="auto"
        >
            <SimpleGrid columns={7} spacing={2}>
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <Box
                            key={`${rowIndex}-${colIndex}`}
                            bg="blue.600"
                            w={12}
                            h={12}
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            onClick={() => onColumnClick(colIndex)}
                            cursor={currentPlayer !== null ? "pointer" : "default"}
                        >
                            <Circle
                                size="40px"
                                bg={
                                    cell === null
                                        ? "white"
                                        : cell === 0
                                            ? "red.500"
                                            : "yellow.500"
                                }
                            />
                        </Box>
                    ))
                )}
            </SimpleGrid>
        </Box>
    );
};

export default Connect4Board;