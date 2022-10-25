import React, { useEffect, useRef, useState } from 'react'
import {
  Center,
  Text,
  Box,
  VStack,
  Pressable,
  Input,
  Accordion,
  Button,
} from 'native-base'
import ThemeToggle from '../components/ThemeToggle'
import AnimatedCheckbox from 'react-native-checkbox-reanimated'
import {
  StyleSheet,
  Animated,
  SafeAreaView,
  View,
  StatusBar,
  TextInput,
  FlatList,
} from 'react-native'
import { Swipeable, RectButton, ScrollView } from 'react-native-gesture-handler'
import TaskItem from '../components/TaskItem'

export interface TaskItemInterface {
  index: number
  title: string
}

const HomeScreen: React.FC<any> = () => {
  const TITLES = [
    'Do groceries',
    'Go to the gym',
    'Walk the dog',
    'Take the kid from school',
  ]

  const dataArray = [
    { title: 'First Element', description: 'Lorem ipsum dolor sit amet' },
    {
      title: 'Second Element',
      description: 'Lorem ipsum dolor sit ametawdafgsregszafgzdhrghzdghzrsef',
    },
    {
      title: 'Third Element',
      description: 'Loras`fgzdtrsethaawha`whgsem ipsum dolor sit amet',
    },
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

  const data = [
    {
      id: 0,
      title: 'Bla',
      description: 'ghznesha`r`f`segfae``esg`segesgafg`sf`a',
    },
    {
      id: 1,
      title: 'Bla bla',
      description:
        'ghznesha`r`f`sages`f`wagfawegfae`gafg`sf`awafs`gsghw`fghzegzegzse',
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'default'} />
      <Text style={styles.title}>Tasks</Text>
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
      {/* <View style={styles.containerTest}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AccordionTest title={item.title} description={item.description} />
          )}
        />
      </View> */}
    </SafeAreaView>
  )
}

export default HomeScreen

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
