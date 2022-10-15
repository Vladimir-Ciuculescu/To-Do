import React from 'react'
import { Center, Text, Box } from 'native-base'

const MainScreen: React.FC<any> = () => {
  return (
    <Center
      _dark={{ bg: 'blueGray.900' }}
      _light={{ bg: 'blueGray.50' }}
      px={4}
      flex={1}
    >
      <Box>
        <Text>Hello thereawdad</Text>
      </Box>
    </Center>
  )
}

export default MainScreen
