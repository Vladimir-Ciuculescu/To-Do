import React, { useEffect, useState } from 'react'
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
  FormControl,
} from 'native-base'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import ColorBox from './ColorBox'
import { colorsList } from '../consts/colorsListTypes'
import useColor from '../hooks/useColor'
import Realm from 'realm'
import { TaskListSchema, TaskSchema } from '../schemas/schemas'

interface AddTasksListModalProps {
  isOpen: boolean
  closeModal: () => void
}

const AddTasksListModal: React.FC<AddTasksListModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const [selectedColorId, setSelectedColorId] = useState<number>(1)
  const [input, setInput] = useState<string>('')
  const [isInvalid, setIsInvalid] = useState<boolean>(false)

  const { UUID } = Realm.BSON

  const selectedColor = useColor(
    colorsList[selectedColorId - 1].lightColor,
    colorsList[selectedColorId - 1].darkColor,
  )

  const onSelectColor = (id: number) => {
    setSelectedColorId(id)
  }

  const resetModal = () => {
    closeModal()
    setInput('')
  }

  const AddTaskList = async () => {
    if (input === '') {
      setIsInvalid(true)
    } else {
      const realm = await Realm.open({
        path: 'myrealm',
        schema: [TaskSchema, TaskListSchema],
      })

      let taskList

      realm.write(() => {
        taskList = realm.create('TaskList', {
          _id: new UUID(),
          name: input,
          lightColor: colorsList[selectedColorId - 1].lightColor,
          darkColor: colorsList[selectedColorId - 1].darkColor,
        })
      })

      realm.close()

      resetModal()
    }
  }

  useEffect(() => {
    if (input !== '') {
      setIsInvalid(false)
    }
  }, [input])

  return (
    <Modal animationType="slide" visible={isOpen}>
      <KeyboardAvoidingView style={stlyes.container}>
        <Box position={'absolute'} top="8%" right="10%">
          <Pressable onPress={resetModal}>
            <EvilIcons name="close" size={40} />
          </Pressable>
        </Box>
        <Center>
          <VStack>
            <Text textAlign="center" fontSize={28} fontWeight={800} pb={4}>
              Create a new Task list
            </Text>

            <Box alignItems="center" w="90%" alignSelf="center">
              <FormControl isInvalid={isInvalid}>
                <Input
                  value={input}
                  onChangeText={(e) => setInput(e)}
                  variant="outline"
                  w="90%"
                  size="2xl"
                  _light={{
                    borderColor: selectedColor,
                    _focus: {
                      borderColor: selectedColor,
                    },
                  }}
                />
                <FormControl.ErrorMessage
                  leftIcon={<Entypo name="warning" size={18} />}
                >
                  The name for task list cannot be empty
                </FormControl.ErrorMessage>
              </FormControl>
            </Box>

            <HStack space={4} alignSelf="center" mt={3} mb={5}>
              {colorsList.map((color: any) => (
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
