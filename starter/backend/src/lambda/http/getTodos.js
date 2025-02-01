import { getUserId } from '../utils.mjs'
import { getTodosForUser } from '../../businessLogic/todos.mjs'

export const handler = async (event) => {
  const userId = getUserId(event)
  const items = await getTodosForUser(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }
}