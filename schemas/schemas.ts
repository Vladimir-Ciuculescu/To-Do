export const TaskSchema = {
  name: 'Task',
  properties: {
    _id: 'int',
    name: 'string',
    status: 'string?',
  },
  primaryKey: '_id',
}

export const TaskListSchema = {
  name: 'TaskList',
  primaryKey: '_id',
  properties: {
    _id: 'uuid',
    name: 'string',
    lightColor: 'string',
    darkColor: 'string',
  },
}
