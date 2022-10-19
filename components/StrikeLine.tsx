import { Divider } from 'native-base'
import React, { useEffect } from 'react'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface StrikeLineInterface {
  striked: boolean
}

const StrikeLine: React.FC<StrikeLineInterface> = ({ striked }) => {
  const AnimatedDivider = Animated.createAnimatedComponent(Divider)

  const strikeLineWidth = useSharedValue(0)

  const strikeLineAnimatedStlye = useAnimatedStyle(() => ({
    width: `${strikeLineWidth.value * 100}%`,
  }))

  useEffect(() => {
    const easing = Easing.out(Easing.quad)

    if (striked) {
      strikeLineWidth.value = withTiming(1, { duration: 400, easing })
    } else {
      strikeLineWidth.value = withTiming(0, { duration: 400, easing })
    }
  })

  return (
    <AnimatedDivider
      position="absolute"
      style={strikeLineAnimatedStlye}
      mt={4}
    />
  )
}

export default StrikeLine
