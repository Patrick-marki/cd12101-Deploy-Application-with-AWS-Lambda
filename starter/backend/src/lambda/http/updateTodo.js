import { getUserId } from '../utils.mjs'
import { updateTodoItem } from '../../businessLogic/todos.mjs'

export const handler = async (event) => {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
  const updatedItem = await updateTodoItem(userId, todoId, updatedTodo)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: updatedItem
    })
  }
}