import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native'
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps,
} from 'react-native-gesture-handler'
import { TaskItemInterface } from '../screens/HomeScreen'
import Animated, {
  Easing,
  EasingNode,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import TaskLabel from './TaskLabel'
import {
  Box,
  HStack,
  themeTools,
  useColorMode,
  useColorModeValue,
} from 'native-base'
import theme from '../Theme'
import AnimatedCheckbox from 'react-native-checkbox-reanimated'
import StrikeLine from './StrikeLine'

interface ListItem
  extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  task: TaskItemInterface
  onDismiss?: (task: TaskItemInterface) => void
}

const LIST_ITEM_DIMENSION = 70

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const X_THRESHOLD = -SCREEN_WIDTH * 0.17

const TaskItem: React.FC<ListItem> = ({
  task,
  onDismiss,
  simultaneousHandlers,
}) => {
  const [checked, setChecked] = useState(false)
  const [isHalfSwiped, setIsHalfSwiped] = useState(false)

  const translateX = useSharedValue(0)
  const itemHeight = useSharedValue(LIST_ITEM_DIMENSION)
  const iconMarginVertical = useSharedValue(10)
  const iconOpacity = useSharedValue(1)
  const hStackOffset = useSharedValue(0)

  const hStackAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateX: hStackOffset.value,
        },
      ],
    }),
    [checked],
  )

  const activeTextColor = themeTools.getColor(
    theme,
    useColorModeValue('darkText', 'lightText'),
  )

  const doneTextColor = themeTools.getColor(
    theme,
    useColorModeValue('muted.400', 'muted.600'),
  )

  // const theme = useTheme()

  const highlightColor = themeTools.getColor(
    theme,
    useColorModeValue('blue.500', 'blue.400'),
  )

  const boxStroke = themeTools.getColor(
    theme,
    useColorModeValue('muted.300', 'muted.500'),
  )

  const checkmarkColor = themeTools.getColor(
    theme,
    useColorModeValue('white', 'white'),
  )
  useEffect(() => {
    const easing = Easing.out(Easing.quad)
    if (checked) {
      hStackOffset.value = withSequence(
        withTiming(4, { duration: 200, easing }),
        withTiming(0, { duration: 200, easing }),
      )
    }
  })

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      const offSet = isHalfSwiped
        ? event.translationX - LIST_ITEM_DIMENSION
        : event.translationX
      translateX.value = offSet
    },

    onEnd: () => {
      //If task is dragged too much on the left
      if (translateX.value < -SCREEN_WIDTH * 0.4) {
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 500 })
        itemHeight.value = withTiming(0)
        iconMarginVertical.value = withTiming(0)
        iconOpacity.value = withTiming(0, { duration: 300 }, (isFinished) => {
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

  const AnimatedHStak = Animated.createAnimatedComponent(HStack)

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
          <HStack alignItems="center">
            <Box width={37} height={37} ml={-3} mr={3}>
              <Pressable onPress={() => setChecked(!checked)}>
                <AnimatedCheckbox
                  boxOutlineColor={boxStroke}
                  highlightColor={highlightColor}
                  checkmarkColor={checkmarkColor}
                  checked={checked}
                />
              </Pressable>
            </Box>

            <AnimatedHStak style={hStackAnimatedStyle}>
              <TaskLabel
                textColor={activeTextColor}
                doneTextColor={doneTextColor}
                label={task.title}
                checked={checked}
              />
              <StrikeLine striked={checked} />
            </AnimatedHStak>
          </HStack>
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

  iconContaier: {
    height: LIST_ITEM_DIMENSION,
    width: LIST_ITEM_DIMENSION,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: '5%',
  },
})

export default TaskItem
