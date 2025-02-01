import { v4 as uuidv4 } from 'uuid'
import { getUserId } from '../utils.mjs'
import AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler = async (event) => {
  console.log('Processing event: ', event)

  const userId = getUserId(event)
  console.log(`Extracted userId: ${userId}`)

  const todoId = uuidv4()
  console.log(`Generated todoId: ${todoId}`)

  const newTodo = JSON.parse(event.body)
  console.log('Parsed newTodo: ', newTodo)

  const newItem = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    ...newTodo,
    attachmentUrl: ``
  }
  console.log('Constructed newItem: ', newItem)

  await docClient.put({
    TableName: todosTable,
    Item: newItem
  }).promise()
  console.log(`Successfully inserted newItem with todoId: ${todoId} into table: ${todosTable}`)

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