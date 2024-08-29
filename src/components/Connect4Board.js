import React from 'react';
import { Box, SimpleGrid, Circle } from '@chakra-ui/react';

const Connect4Board = ({ board, onColumnClick, currentPlayer }) => {
    return (
        <Box
            bg="brand.500"
            p={6}
            borderRadius="xl"
            width="fit-content"
            margin="auto"
            boxShadow="lg"
        >
            <SimpleGrid columns={7} spacing={3}>
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <Box
                            key={`${rowIndex}-${colIndex}`}
                            bg="brand.600"
                            w={14}
                            h={14}
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            onClick={() => onColumnClick(colIndex)}
                            cursor={currentPlayer !== null ? "pointer" : "default"}
                            transition="all 0.2s"
                            _hover={currentPlayer !== null ? { transform: "scale(1.1)" } : {}}
                        >
                            <Circle
                                size="45px"
                                bg={
                                    cell === null
                                        ? "white"
                                        : cell === 0
                                            ? "red.500"
                                            : "yellow.500"
                                }
                                boxShadow="inset 0 0 10px rgba(0,0,0,0.1)"
                            />
                        </Box>
                    ))
                )}
            </SimpleGrid>
        </Box>
    );
};

export default Connect4Board;