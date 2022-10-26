import {
  View,
  Button,
  Text,
  Pressable,
  Center,
  Divider,
  VStack,
  HStack,
  Box,
  themeTools,
  useColorModeValue,
  Fab,
  FlatList,
  Card,
} from 'native-base'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import Theme from '../Theme'
import ThemeToggle from '../components/ThemeToggle'
import { TaskItemInterface } from './TaskList'

const list = [
  {
    id: 1,
    title: 'Gym',
  },
  {
    id: 2,
    title: 'Groceries',
  },
  {
    id: 3,
    title: 'Kid',
  },
]

const windowHeight = Dimensions.get('window').height

const HomeScreen = () => {
  const navigation = useNavigation()

  const ifyColor = themeTools.getColor(
    Theme,
    useColorModeValue('info.400', 'blue.400'),
  )

  const todoColor = themeTools.getColor(
    Theme,
    useColorModeValue('darkText', 'whiteText'),
  )

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        top: '10%',
      }}
    >
      <HStack>
        <Divider color="red" />
        <Box mt={-7} pl={8} pr={8}>
          <HStack space={2}>
            <Text fontWeight={'bold'} fontSize={38} color={todoColor}>
              ToDo
            </Text>
            <Text fontWeight={300} fontSize={38} color={ifyColor}>
              Ify
            </Text>
          </HStack>
        </Box>
        <Divider color="red" />
      </HStack>
      <VStack space={2} width="85%" top={9}>
        {list.map((item) => (
          <Pressable onPress={() => navigation.navigate('TaskList')}>
            <Box
              rounded="xl"
              width="100%"
              bg="primary.300"
              p="4"
              shadow={9}
              _text={{
                fontSize: 'md',
                fontWeight: 'bold',
              }}
            >
              {item.title}
            </Box>
          </Pressable>
        ))}
      </VStack>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  title: {
    fontSize: 60,
    paddingLeft: 20,
    paddingTop: 70,
  },
})
