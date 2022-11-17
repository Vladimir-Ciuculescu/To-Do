import React, { useEffect, useRef, useState } from 'react'
import { Text, VStack, Fab, Box, Icon, Divider, HStack } from 'native-base'
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import TaskItem from '../components/TaskItem'
import Feather from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'
import AddTaskModal from '../components/AddTaskModal'
import { useNavigation } from '@react-navigation/native'
import { makeStyledComponent } from '../utils/Styled'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import useColor from '../hooks/useColor'

export interface TaskItemInterface {
  index: number
  title: string
}

type RootStackParamList = {
  Home: undefined
  Profile: { userId: string }
  Feed: { sort: 'latest' | 'top' } | undefined
}

type Props = NativeStackScreenProps<RootStackParamList, 'Profile', 'MyStack'>

const TaskList: React.FC<Props> = ({ route, navigation: navigationProps }) => {
  const TITLES = [
    'Do groceries',
    'Go to the gym',
    'Walk the dog',
    'Take the kid from school',
  ]

  const TASKS: TaskItemInterface[] = TITLES.map(
    (title, index, description) => ({
      title,
      index,
      description,
    }),
  )

  const StyledView = makeStyledComponent(View)

  const [tasks, setTasks] = useState(TASKS)

  const navigation = useNavigation()

  const [showModal, setShowModal] = useState(false)

  const scrollRef = useRef(null)

  const removeTask = (task: TaskItemInterface) => {
    setTasks(tasks.filter((item) => item.index !== task.index))
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const taskColor = useColor(route.params.lightColor, route.params.darkColor)

  useEffect(() => {
    navigationProps.setOptions({
      title: route.params.listName,
      headerBackTitleVisible: false,
      headerTitleAlign: 'left',
      header: () => (
        <SafeAreaView>
          <VStack>
            <HStack alignItems="center">
              <TouchableOpacity onPress={() => navigationProps.goBack()}>
                <Entypo
                  color={taskColor}
                  style={{ marginLeft: 10 }}
                  name="arrow-long-left"
                  size={30}
                />
              </TouchableOpacity>
              <VStack left={5}>
                <Text color={taskColor} fontSize={30} fontWeight="bold">
                  {route.params.listName}
                </Text>
                <Text color={taskColor}>2 of 4 completed</Text>
              </VStack>
            </HStack>
            <Divider
              marginTop={2}
              w="95%"
              bg={taskColor}
              thickness="3"
              alignSelf={'center'}
            />
          </VStack>
        </SafeAreaView>
      ),
    })
  }, [navigationProps])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'default'} />

      <ScrollView ref={scrollRef} style={{ marginTop: 20 }}>
        <VStack space={5}>
          {tasks.map((task) => (
            <TaskItem
              simultaneousHandlers={scrollRef}
              onDismiss={removeTask}
              key={task.index}
              task={task}
            />
          ))}
        </VStack>
      </ScrollView>
      <Fab
        onPress={() => setShowModal(true)}
        mb={4}
        mr={4}
        w={60}
        h={60}
        size="lg"
        icon={<Icon color="white" as={<Feather name="plus" />} size="sm" />}
      />
      <AddTaskModal isOpen={showModal} closeModal={closeModal} />
    </SafeAreaView>
  )
}

export default TaskList

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  containerTest: {
    height: '100%',
    backgroundColor: 'red',
  },

  title: {
    fontSize: 60,
    paddingLeft: 20,
    paddingTop: 70,
  },
  test: {
    width: '60%',
    justifyContent: 'center',
    backgroundColor: 'red',
    paddingLeft: 20,
    shadowOpacity: 0.08,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 10,
    borderRadius: 10,
  },
})
