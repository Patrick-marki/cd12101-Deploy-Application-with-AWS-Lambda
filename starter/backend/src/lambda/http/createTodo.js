import { v4 as uuidv4 } from 'uuid'
import { getUserId } from '../utils.mjs'
import AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler = async (event) => {
  console.log('Processing event: ', event)

  const userId = getUserId(event)
  const todoId = uuidv4()
  const newTodo = JSON.parse(event.body)

  const newItem = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    ...newTodo,
    attachmentUrl: ``
  }

  await docClient.put({
    TableName: todosTable,
    Item: newItem
  }).promise()

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