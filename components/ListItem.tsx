import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps,
} from 'react-native-gesture-handler'
import { TaskItem } from '../screens/HomeScreen'
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
interface ListItem
  extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  task: TaskItem
  onDismiss?: (task: TaskItem) => void
}

const LIST_ITEM_DIMENSION = 70

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const X_THRESHOLD = -SCREEN_WIDTH * 0.17

const ListItem: React.FC<ListItem> = ({
  task,
  onDismiss,
  simultaneousHandlers,
}) => {
  const [isHalfSwiped, setIsHalfSwiped] = useState(false)
  const [actualValue, setActualValue] = useState(20)

  const translateX = useSharedValue(isHalfSwiped ? -LIST_ITEM_DIMENSION : 0)
  const itemHeight = useSharedValue(LIST_ITEM_DIMENSION)
  const iconMarginVertical = useSharedValue(10)
  const iconOpacity = useSharedValue(1)

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    // },

    onActive: (event) => {
      const distance = isHalfSwiped
        ? event.translationX - LIST_ITEM_DIMENSION
        : event.translationX
      translateX.value = distance
    },

    onEnd: () => {
      //If task is dragged too much on the left
      if (translateX.value < -SCREEN_WIDTH * 0.4) {
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 500 })
        itemHeight.value = withTiming(0)
        iconMarginVertical.value = withTiming(0)
        iconOpacity.value = withTiming(0, undefined, (isFinished) => {
          if (isFinished && onDismiss) {
            runOnJS(onDismiss)(task)
          }
        })
        runOnJS(setIsHalfSwiped)(false)

        //If is between initial position or not too much to be dragged on the left
      } else if (
        translateX.value >= -SCREEN_WIDTH * 0.4 &&
        translateX.value <= -SCREEN_WIDTH * 0.17
      ) {
        translateX.value = withTiming(-LIST_ITEM_DIMENSION, { duration: 500 })
        runOnJS(setIsHalfSwiped)(true)
      } else {
        translateX.value = withTiming(0, { duration: 500 })
        runOnJS(setIsHalfSwiped)(false)
      }
    },
  })

  const taskReanimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }))

  const IconAnimatedStyle = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value < X_THRESHOLD ? 1 : 0, {
      duration: 300,
    })
    return { opacity }
  })

  const taskContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      marginVertical: iconMarginVertical.value,
      opacity: iconOpacity.value,
    }
  })

  return (
    <Animated.View style={[styles.taskContainer, taskContainerAnimatedStyle]}>
      <Animated.View style={[styles.iconContaier, IconAnimatedStyle]}>
        <FontAwesome
          name="trash-o"
          size={LIST_ITEM_DIMENSION * 0.4}
          color="red"
        />
      </Animated.View>
      <PanGestureHandler
        simultaneousHandlers={simultaneousHandlers}
        onGestureEvent={panGesture}
      >
        <Animated.View style={[styles.task, taskReanimatedStyle]}>
          <Text style={styles.taskTitle}>{task.title}</Text>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  taskContainer: {
    width: '100%',
    alignItems: 'center',
  },

  task: {
    width: '90%',
    height: LIST_ITEM_DIMENSION,

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
  iconContaier: {
    height: LIST_ITEM_DIMENSION,
    width: LIST_ITEM_DIMENSION,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: '5%',
  },
})

export default ListItem
