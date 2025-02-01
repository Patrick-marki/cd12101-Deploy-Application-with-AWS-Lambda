import { getUserId } from '../utils.mjs'
import { createTodoItem } from '../../businessLogic/todos.mjs'

export const handler = async (event) => {
  console.log('Processing event: ', event)

  const userId = getUserId(event)
  const newTodo = JSON.parse(event.body)
  console.log('userId:', userId)
  console.log('newTodo:', newTodo)

  const newItem = await createTodoItem(userId, newTodo)
  console.log('Created new todo item:', newItem)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}