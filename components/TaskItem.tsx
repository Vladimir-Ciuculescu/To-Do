import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Animated as Animation,
  LayoutAnimation,
} from 'react-native'
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps,
  TextInput,
} from 'react-native-gesture-handler'
import { TaskItemInterface } from '../screens/TaskList'
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import TaskLabel from './TaskLabel'
import {
  Box,
  HStack,
  themeTools,
  useColorModeValue,
  Pressable,
  Text,
} from 'native-base'
import theme from '../Theme'
import AnimatedCheckbox from 'react-native-checkbox-reanimated'
import StrikeLine from './StrikeLine'
interface ListItem
  extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  task: TaskItemInterface
  onDismiss?: (task: TaskItemInterface) => void
}

//Consts
const { width: SCREEN_WIDTH } = Dimensions.get('window')
const X_THRESHOLD = -SCREEN_WIDTH * 0.15
const LIST_ITEM_DIMENSION = 70

const TaskItem: React.FC<ListItem> = ({
  task,
  onDismiss,
  simultaneousHandlers,
}) => {
  const [checked, setChecked] = useState(false)
  const [isHalfSwiped, setIsHalfSwiped] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [subject, setSubject] = useState(task.title)
  const [showDescription, setShowDescription] = useState(false)

  const translateX = useSharedValue(0)
  const itemHeight = useSharedValue(LIST_ITEM_DIMENSION)
  const iconMarginVertical = useSharedValue(10)
  const iconOpacity = useSharedValue(1)
  const hStackOffset = useSharedValue(0)
  const marginTopOffset = useSharedValue(0)
  const rotateDegrees = useSharedValue(0)

  const animationController = useRef(new Animation.Value(0)).current

  const toggleAnimation = {
    duration: 20,
    update: {
      duration: 300,
      property: LayoutAnimation.Properties.opacity,
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      duration: 300,
      property: LayoutAnimation.Properties.opacity,
      type: LayoutAnimation.Types.easeInEaseOut,
    },
  }

  const toggleTaskDescription = () => {
    const config = {
      duration: 300,
      toValue: showDescription ? 0 : 1,
      useNativeDriver: true,
    }
    Animation.timing(animationController, config).start()
    LayoutAnimation.configureNext(toggleAnimation)
    setShowDescription(!showDescription)
  }

  const rotation = useDerivedValue(() => {
    return interpolate(rotateDegrees.value, [0, 360], [0, 360])
  })

  const activeTextColor = themeTools.getColor(
    theme,
    useColorModeValue('darkText', 'lightText'),
  )

  const doneTextColor = themeTools.getColor(
    theme,
    useColorModeValue('muted.400', 'muted.600'),
  )

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

    if (checked || isEdit) {
      hStackOffset.value = withSequence(
        withTiming(4, { duration: 200, easing }),
        withTiming(0, { duration: 200, easing }),
      )
    }

    if (showDescription) {
      rotateDegrees.value = withTiming(90, { duration: 200 })
    } else {
      rotateDegrees.value = withTiming(0, { duration: 200 })
    }
  })

  useEffect(() => {
    if (checked) {
      setIsEdit(false)
    }
  }, [checked])

  const makeTaskEditable = () => {
    setChecked(false)
    setIsEdit(true)
  }

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
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 })
        itemHeight.value = withTiming(0)
        iconMarginVertical.value = withTiming(0)
        marginTopOffset.value = withTiming(-90, { duration: 1000 })
        iconOpacity.value = withTiming(0, { duration: 1000 }, (isFinished) => {
          if (isFinished && onDismiss) {
            runOnJS(onDismiss)(task)
          }
        })
        runOnJS(setIsHalfSwiped)(false)

        //If is between initial position or not too much to be dragged on the left
      } else if (
        translateX.value >= -SCREEN_WIDTH * 0.4 &&
        translateX.value <= -SCREEN_WIDTH * 0.1
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

    const marginTop = -marginTopOffset.value

    return { opacity, marginTop }
  })

  const taskContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: marginTopOffset.value,
      opacity: iconOpacity.value,
    }
  })

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: rotation.value + 'deg' }],
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
          <View style={styles.overflowContainer}>
            <HStack alignItems="center" pt={showDescription ? 4 : 0}>
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

              <HStack>
                {isEdit ? (
                  <TextInput
                    style={styles.taskInput}
                    value={subject}
                    onBlur={() => setIsEdit(false)}
                    onChangeText={(e) => setSubject(e)}
                    autoFocus
                  />
                ) : (
                  <Box>
                    <Pressable onPress={makeTaskEditable}>
                      <TaskLabel
                        textColor={activeTextColor}
                        doneTextColor={doneTextColor}
                        label={subject}
                        checked={checked}
                      />
                    </Pressable>
                    <StrikeLine striked={checked} />
                  </Box>
                )}
              </HStack>

              <Box position="absolute" right={0} top={showDescription ? 5 : 1}>
                <Pressable onPress={() => toggleTaskDescription()}>
                  <Animated.View style={[rotateStyle]}>
                    <Feather
                      name="arrow-right"
                      size={LIST_ITEM_DIMENSION * 0.4}
                      color="black"
                    />
                  </Animated.View>
                </Pressable>
              </Box>
            </HStack>

            {showDescription ? (
              <Box pt={4} pb={4}>
                <Text fontSize={16}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </Text>
              </Box>
            ) : null}
          </View>
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

  overflowContainer: {
    overflow: 'hidden',
    paddingHorizontal: '3%',
  },

  task: {
    width: '85%',
    minHeight: 70,
    height: 'auto',
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

  taskInput: {
    fontSize: 18,
  },

  iconContaier: {
    height: LIST_ITEM_DIMENSION,
    width: LIST_ITEM_DIMENSION,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: '5%',
  },

  taskDescription: {},
})

export default TaskItem
