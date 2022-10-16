import React from 'react'
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

const lIST_ITEM_HIEGHT = 70

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const X_THRESHOLD = -SCREEN_WIDTH * 0.25

const ListItem: React.FC<ListItem> = ({
  task,
  onDismiss,
  simultaneousHandlers,
}) => {
  const translateX = useSharedValue(0)
  const itemHeight = useSharedValue(lIST_ITEM_HIEGHT)
  const iconMarginVertical = useSharedValue(10)
  const iconOpacity = useSharedValue(1)

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = event.translationX
    },

    onEnd: () => {
      const shouldBeDismissed = translateX.value < X_THRESHOLD

      if (shouldBeDismissed) {
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 500 })
        itemHeight.value = withTiming(0)
        iconMarginVertical.value = withTiming(0)
        iconOpacity.value = withTiming(0, undefined, (isFinished) => {
          if (isFinished && onDismiss) {
            runOnJS(onDismiss)(task)
          }
        })
      } else {
        translateX.value = withTiming(0, { duration: 500 })
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
        <FontAwesome name="trash-o" size={lIST_ITEM_HIEGHT * 0.4} color="red" />
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
    height: lIST_ITEM_HIEGHT,

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
    height: lIST_ITEM_HIEGHT,
    width: lIST_ITEM_HIEGHT,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: '10%',
  },
})

export default ListItem
