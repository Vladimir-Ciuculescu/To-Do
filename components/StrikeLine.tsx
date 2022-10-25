import { Divider, themeTools, useColorModeValue } from 'native-base'
import React, { useEffect } from 'react'
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import theme from '../Theme'

interface StrikeLineInterface {
  striked: boolean
}

const StrikeLine: React.FC<StrikeLineInterface> = ({ striked }) => {
  const AnimatedDivider = Animated.createAnimatedComponent(Divider)

  const strikeLineWidth = useSharedValue(0)
  const strikeLineColor = useSharedValue(0)

  const activeTextColor = themeTools.getColor(
    theme,
    useColorModeValue('darkText', 'lightText'),
  )

  const doneTextColor = themeTools.getColor(
    theme,
    useColorModeValue('muted.400', 'muted.600'),
  )

  const strikeLineAnimatedStlye = useAnimatedStyle(() => ({
    width: `${strikeLineWidth.value * 100}%`,
    backgroundColor: interpolateColor(
      strikeLineColor.value,
      [0, 1],
      [activeTextColor, doneTextColor],
    ),
  }))

  useEffect(() => {
    const easing = Easing.out(Easing.quad)

    if (striked) {
      strikeLineWidth.value = withTiming(1, { duration: 400, easing })
      strikeLineColor.value = withDelay(
        1000,
        withTiming(1, { duration: 400, easing }),
      )
    } else {
      strikeLineWidth.value = withTiming(-1, { duration: 400, easing })
    }
  })

  return (
    <AnimatedDivider
      position="absolute"
      style={strikeLineAnimatedStlye}
      mt={3}
      size={0.5}
    />
  )
}

export default StrikeLine
