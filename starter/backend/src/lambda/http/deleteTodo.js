import { getUserId } from '../utils.mjs'
import { deleteTodoItem } from '../../businessLogic/todos.mjs'

export const handler = async (event) => {
  console.log('Processing event: ', event)

  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  console.log('userId:', userId)
  console.log('todoId:', todoId)

  try {
    await deleteTodoItem(userId, todoId)
    console.log('Todo item deleted:', todoId)
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      }
    }
  } catch (e) {
    console.error('Error deleting todo item:', e)
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: e.message
      })
    }
  }
}