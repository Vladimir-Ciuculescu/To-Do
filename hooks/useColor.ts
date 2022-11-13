import { useColorModeValue, themeTools } from 'native-base'
import Theme from '../Theme'

const useColor = (lightColor: string, darkColor: string) => {
  return themeTools.getColor(Theme, useColorModeValue(lightColor, darkColor))
}

export default useColor
