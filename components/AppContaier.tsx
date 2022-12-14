import React from 'react'
import { NativeBaseProvider } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'
import theme from '../Theme'

interface IProps {
  children: React.ReactNode
}

const AppContainer: React.FC<IProps> = (props: IProps) => {
  return (
    <NavigationContainer>
      <NativeBaseProvider theme={theme}>{props.children}</NativeBaseProvider>
    </NavigationContainer>
  )
}

export default AppContainer
