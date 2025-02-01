import AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export async function getTodoById(userId, todoId) {
  console.log('Getting todo item by ID:', { userId, todoId })
  const result = await docClient.get({
    TableName: todosTable,
    Key: {
      userId,
      todoId
    }
  }).promise()
  console.log('Retrieved todo item:', result.Item)
  return result.Item
}

export async function createTodo(todo) {
  console.log('Creating new todo item:', todo)
  await docClient.put({
    TableName: todosTable,
    Item: todo
  }).promise()
  console.log('Todo item created:', todo)
}

export async function updateTodo(userId, todoId, updatedTodo) {
  console.log('Updating todo item:', { userId, todoId, updatedTodo })
  const result = await docClient.update({
    TableName: todosTable,
    Key: {
      userId,
      todoId
    },
    UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': updatedTodo.name,
      ':dueDate': updatedTodo.dueDate,
      ':done': updatedTodo.done
    },
    ReturnValues: 'ALL_NEW'
  }).promise()
  console.log('Updated todo item:', result.Attributes)
  return result.Attributes
}

export async function updateAttachmentUrl(userId, todoId, attachmentUrl) {
  console.log('Updating attachment URL for todo item:', { userId, todoId, attachmentUrl })
  const result = await docClient.update({
    TableName: todosTable,
    Key: {
      userId,
      todoId
    },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': attachmentUrl
    },
    ReturnValues: 'ALL_NEW'
  }).promise()
  console.log('Updated attachment URL for todo item:', result.Attributes)
  return result.Attributes
}


export async function deleteTodo(userId, todoId) {
  console.log('Deleting todo item:', { userId, todoId })
  await docClient.delete({
    TableName: todosTable,
    Key: {
      userId,
      todoId
    },
    ConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()
  console.log('Todo item deleted:', { userId, todoId })
}

export async function getAllTodos(userId) {
  console.log('Getting all todos for user:', userId)
  const result = await docClient.query({
    TableName: todosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()
  console.log('Retrieved todos:', result.Items)
  return result.Items
}