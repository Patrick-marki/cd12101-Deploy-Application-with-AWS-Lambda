import { getUserId } from '../utils.mjs'
import { getUploadUrlForTodoItem } from '../../businessLogic/todos.mjs'

export const handler = async (event) => {
  console.log('Processing event: ', event)

  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  console.log('userId:', userId)
  console.log('todoId:', todoId)

  const url = getUploadUrlForTodoItem(userId, todoId)
  console.log('Generated upload URL:', url)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}