import React from 'react'
import { Text } from 'react-native'
import AppContainer from './components/AppContaier'
import Navigation from './Navigation'
import TaskList from './screens/TaskList'

const App = () => {
  return (
    <AppContainer>
      <Navigation />
    </AppContainer>
  )
}

export default App
