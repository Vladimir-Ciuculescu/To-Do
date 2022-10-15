import React from 'react'
import { Center, Text, Box, VStack } from 'native-base'
import ThemeToggle from '../components/ThemeToggle'

const MainScreen: React.FC<any> = () => {
  return (
    <Center
      _dark={{ bg: 'blueGray.900' }}
      _light={{ bg: 'blueGray.50' }}
      px={4}
      flex={1}
    >
      <VStack space={2} alignItems={'center'}>
        <Box alignItems={'center'}>
          <Text>Hello thereawdad</Text>
          <ThemeToggle />
        </Box>
      </VStack>
    </Center>
  )
}

export default MainScreen
