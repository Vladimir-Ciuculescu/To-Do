import Realm from 'realm'

export const TODOLIST_SCHEMA = 'TodoList'
export const TODO_SCHEMA = 'Todo'

export const TodoSchema = {
  name: TODO_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: { type: 'string', indexed: true },
    completed: { type: 'bool', default: false },
  },
}

export const TodoListSchema = {
  name: TODOLIST_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    todos: { type: 'list', objectType: TODO_SCHEMA },
  },
}
