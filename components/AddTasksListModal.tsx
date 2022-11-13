import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import {
  Box,
  Center,
  Input,
  Pressable,
  VStack,
  Text,
  HStack,
  Button,
} from 'native-base'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import ColorBox from './ColorBox'
import { lightColorsList } from '../consts/colorsListTypes'
import useColor from '../hooks/useColor'
import Realm from 'realm'

interface AddTasksListModalProps {
  isOpen: boolean
  closeModal: () => void
}

const AddTasksListModal: React.FC<AddTasksListModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const TaskListSchema = {
    name: 'TaskList',
    properties: {
      _id: 'int',
      name: 'string',
    },
    primaryKey: '_id',
  }

  const [selectedColorId, setSelectedColorId] = useState<number>(1)
  const [input, setInput] = useState<string>('')

  const selectedColor = useColor(
    lightColorsList[selectedColorId - 1].lightColor,
    lightColorsList[selectedColorId - 1].darkColor,
  )

  const onSelectColor = (id: number) => {
    setSelectedColorId(id)
  }

  const AddTaskList = async () => {
    const realm = await Realm.open({
      path: 'myrealm',
      schema: [TaskListSchema],
    })

    let taskList

    realm.write(() => {
      taskList = realm.create('TaskList', {
        _id: 1,
        name: input,
      })
    })
  }

  return (
    <Modal animationType="slide" visible={isOpen}>
      <KeyboardAvoidingView style={stlyes.container}>
        <Box position={'absolute'} top="8%" right="10%">
          <Pressable onPress={closeModal}>
            <EvilIcons name="close" size={40} />
          </Pressable>
        </Box>
        <Center>
          <VStack>
            <Text textAlign="center" fontSize={28} fontWeight={800} pb={4}>
              Create a new Task list
            </Text>

            <Input
              value={input}
              onChangeText={(e) => setInput(e)}
              variant="outline"
              w="90%"
              size="2xl"
            />
            <HStack space={4} alignSelf="center" mt={3} mb={5}>
              {lightColorsList.map((color: any) => (
                <ColorBox
                  id={color.id}
                  onSelectColor={onSelectColor}
                  lightColor={color.lightColor}
                  darkColor={color.darkColor}
                />
              ))}
            </HStack>
            <Button bg={selectedColor} onPress={AddTaskList}>
              Create !
            </Button>
          </VStack>
        </Center>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const stlyes = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default AddTasksListModal
