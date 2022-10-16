import React, { useEffect, useRef, useState } from 'react'
import { Center, Text, Box, VStack, Pressable } from 'native-base'
import ThemeToggle from '../components/ThemeToggle'
import AnimatedCheckbox from 'react-native-checkbox-reanimated'
import {
  StyleSheet,
  Animated,
  SafeAreaView,
  View,
  StatusBar,
} from 'react-native'
import { Swipeable, RectButton, ScrollView } from 'react-native-gesture-handler'
import ListItem from '../components/ListItem'

export interface TaskItem {
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

  const TASKS: TaskItem[] = TITLES.map((title, index) => ({ title, index }))

  const [tasks, setTasks] = useState(TASKS)

  const scrollRef = useRef(null)

  //   const renderLeftActions = (progress, dragX) => {
  //     const trans = dragX.interpolate({
  //       inputRange: [0, 50, 100, 101],
  //       outputRange: [-20, 0, 0, 1],
  //     })
  //     return (
  //       <RectButton>
  //         <Animated.Text
  //           style={[
  //             styles.actionText,
  //             {
  //               transform: [{ translateX: trans }],
  //             },
  //           ]}
  //         >
  //           Archive
  //         </Animated.Text>
  //       </RectButton>
  //     )
  //   }

  const removeTask = (task: TaskItem) => {
    setTasks(tasks.filter((item) => item.index !== task.index))
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'default'} />
      <Text style={styles.title}>Tasks</Text>
      <ScrollView ref={scrollRef} style={{ flex: 1 }}>
        {tasks.map((task) => (
          <ListItem
            simultaneousHandlers={scrollRef}
            onDismiss={removeTask}
            key={task.index}
            task={task}
          ></ListItem>
        ))}
      </ScrollView>
      {/* <Center
        _dark={{ bg: 'blueGray.900' }}
        _light={{ bg: 'blueGray.50' }}
        px={4}
        flex={1}
      >
        <VStack space={2} alignItems={'center'}>
          <Text>Awdw</Text>
        </VStack>
      </Center> */}
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 60,
    paddingLeft: 20,
    paddingTop: 70,
  },
})
