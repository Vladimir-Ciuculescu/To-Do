import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import { TaskItem } from '../screens/HomeScreen'
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface ListItem {
  task: TaskItem
}

const ListItem: React.FC<ListItem> = ({ task }) => {
  const translateX = useSharedValue(0)

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = event.translationX
    },

    onEnd: () => {
      translateX.value = withTiming(0)
    },
  })

  const rStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }))

  return (
    <View style={styles.taskContainer}>
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View style={[styles.task, rStyle]}>
          <Text style={styles.taskTitle}>{task.title}</Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

const styles = StyleSheet.create({
  taskContainer: {
    width: '100%',
    alignItems: 'center',
  },

  task: {
    width: '90%',
    height: 70,
    marginVertical: 10,
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingLeft: 20,
    shadowOpacity: 0.08,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 10,
    borderRadius: 10,
  },
  taskTitle: {
    fontSize: 16,
  },
})

export default ListItem
