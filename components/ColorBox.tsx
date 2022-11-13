import { Box, Pressable, Square } from 'native-base'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import useColor from '../hooks/useColor'

interface ColorBoxProps {
  id: number
  lightColor: string
  darkColor: string
  onSelectColor: (id: number) => void
}

const ColorBox: React.FC<ColorBoxProps> = ({
  lightColor,
  darkColor,
  onSelectColor,
  id,
}) => {
  const bgColor = useColor(lightColor, darkColor)

  return (
    <TouchableOpacity onPress={() => onSelectColor(id)}>
      <Square borderRadius={5} size="40px" bg={bgColor} />
    </TouchableOpacity>
  )
}

export default ColorBox
