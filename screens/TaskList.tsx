import React, { useEffect, useRef, useState } from 'react'
import { Text, VStack, Fab, Box, Icon } from 'native-base'
import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import TaskItem from '../components/TaskItem'
import Feather from 'react-native-vector-icons/Feather'
import AddTaskModal from '../components/AddTaskModal'
import { useNavigation } from '@react-navigation/native'
import { makeStyledComponent } from '../utils/Styled'
import { AnimatePresence, MotiView } from 'moti'

export interface TaskItemInterface {
  index: number
  title: string
}

const TaskList: React.FC<any> = () => {
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'default'} />

      <ScrollView ref={scrollRef}>
        <MotiView
          from={{
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            type: 'timing',
            duration: 500,
          }}
        >
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
        </MotiView>
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
