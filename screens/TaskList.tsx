import React, { useEffect, useRef, useState } from 'react'
import { Text, VStack } from 'native-base'
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import TaskItem from '../components/TaskItem'
import ThemeToggle from '../components/ThemeToggle'

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

  const [tasks, setTasks] = useState(TASKS)

  const scrollRef = useRef(null)

  const removeTask = (task: TaskItemInterface) => {
    setTasks(tasks.filter((item) => item.index !== task.index))
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'default'} />

      <ScrollView ref={scrollRef}>
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
