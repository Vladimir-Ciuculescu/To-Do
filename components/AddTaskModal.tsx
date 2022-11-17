import { Button, Input, Pressable } from 'native-base'
import React, { useState } from 'react'
import {
  Modal,
  TouchableWithoutFeedback,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native'
import Realm from 'realm'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { TaskSchema, TaskListSchema } from '../schemas/schemas'

interface AddTaskModalProps {
  isOpen: boolean
  closeModal: () => void
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, closeModal }) => {
  const [value, setValue] = useState('')

  // const AddTask = async () => {
  //   const realm = await Realm.open({
  //     path: 'myrealm',
  //     schema: [TaskSchema, TaskListSchema],
  //   })

  //   let task1, task2
  //   realm.write(() => {
  //     task1 = realm.create('Task', {
  //       _id: 1,
  //       name: 'go grocery shopping',
  //       status: 'Open',
  //     })
  //     task2 = realm.create('Task', {
  //       _id: 2,
  //       name: 'go exercise',
  //       status: 'Open',
  //     })
  //     console.log(`created two tasks: ${task1.name} & ${task2.name}`)
  //   })
  // }

  const ShowTasks = async () => {
    // const realm = await Realm.open({
    //   path: 'myrealm',
    //   schema: [TaskSchema, TaskListSchema],
    // })
    // const tasks = realm.objects('Task')
    // console.log(`The lists of tasks are: ${tasks.map((task) => task.name)}`)
  }

  return (
    <Modal visible={isOpen} animationType="slide">
      <KeyboardAvoidingView style={styles.container}>
        <Input value={value} onChangeText={(e) => setValue(e)} />
        <Button onPress={() => AddTask()}>Add it</Button>
        <Button onPress={() => ShowTasks()}>Show them</Button>
        <Pressable onPress={closeModal}>
          <EvilIcons name="close" size={40} />
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default AddTaskModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
