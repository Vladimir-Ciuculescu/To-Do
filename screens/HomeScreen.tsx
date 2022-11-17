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
  Icon,
} from 'native-base'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Theme from '../Theme'
import { TaskItemInterface } from './TaskList'
import Feather from 'react-native-vector-icons/Feather'
import AddTasksListModal from '../components/AddTasksListModal'
import Realm from 'realm'
import { TaskListSchema, TaskSchema } from '../schemas/schemas'
import useColor from '../hooks/useColor'
import ThemeToggle from '../components/ThemeToggle'
import AddTaskModal from '../components/AddTaskModal'

const windowHeight = Dimensions.get('window').height

const HomeScreen = () => {
  const [taskLists, setTaskLists] = useState([])
  const [showModal, setShowModal] = useState(false)

  const navigation = useNavigation()

  const ifyColor = themeTools.getColor(
    Theme,
    useColorModeValue('info.400', 'blue.400'),
  )

  const todoColor = themeTools.getColor(
    Theme,
    useColorModeValue('darkText', 'whiteText'),
  )

  useEffect(() => {
    const showTaskLists = async () => {
      const realm = await Realm.open({
        path: 'myrealm',
        schema: [TaskSchema, TaskListSchema],
      })

      const tasks = realm.objects('TaskList')

      console.log(tasks)

      // realm.write(() => {
      //   tasks.map((item) => {
      //     realm.delete(item)
      //   })
      // })
      setTaskLists(tasks)

      //realm.close()
    }

    showTaskLists()
  }, [])

  const openTaskItemModal = () => {}

  const BackGroundTaskList = (a: string, b: string) => useColor(a, b)

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
        {taskLists.map((item) => (
          <Pressable
            onPress={() =>
              navigation.navigate('TaskList', {
                listName: item.name,
                lightColor: item.lightColor,
                darkColor: item.darkColor,
              })
            }
          >
            <Box
              rounded="xl"
              width="100%"
              p="4"
              bg={BackGroundTaskList(item.lightColor, item.darkColor)}
              shadow={9}
              _text={{
                fontSize: 'md',
                fontWeight: 'bold',
              }}
            >
              {item.name}
            </Box>
          </Pressable>
        ))}
      </VStack>
      <Fab
        onPress={() => setShowModal(true)}
        mb={4}
        mr={4}
        w={60}
        h={60}
        size="lg"
        icon={<Icon color="white" as={<Feather name="plus" />} size="sm" />}
      />
      <AddTasksListModal
        isOpen={showModal}
        closeModal={() => setShowModal(!showModal)}
      />
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
