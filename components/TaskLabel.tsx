import React, { useEffect } from 'react'

import { StyleSheet } from 'react-native'
import { HStack, Text, Box } from 'native-base'
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

interface TaskLabelInterface {
  label: string
  textColor: string
  doneTextColor: string
  checked: boolean
}

const TaskLabel: React.FC<TaskLabelInterface> = ({
  label,
  checked,
  textColor,
  doneTextColor,
}) => {
  const AnimatedText = Animated.createAnimatedComponent(Text)
  const colorText = useSharedValue(0)

  const textColorStyle = useAnimatedStyle(
    () => ({
      color: interpolateColor(
        colorText.value,
        [0, 1],
        [textColor, doneTextColor],
      ),
    }),
    [checked, textColor, doneTextColor],
  )

  useEffect(() => {
    const easing = Easing.out(Easing.quad)

    if (checked) {
      colorText.value = withDelay(
        1000,
        withTiming(1, { duration: 400, easing }),
      )
    } else {
      colorText.value = withTiming(0, { duration: 400, easing })
    }
  }, [checked])

  return (
    <AnimatedText style={textColorStyle} fontSize={18}>
      {label}
    </AnimatedText>
  )
}

export default TaskLabel
