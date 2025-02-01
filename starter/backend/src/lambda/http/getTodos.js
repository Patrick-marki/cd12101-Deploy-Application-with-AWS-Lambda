import { getUserId } from '../utils.mjs'
import AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const createdAtIndex = process.env.TODOS_CREATED_AT_INDEX

export const handler = async (event) => {
  console.log('Processing event: ', event)

  const userId = getUserId(event)
  console.log('Retrieved userId: ', userId)

  const result = await docClient.query({
    TableName: todosTable,
    IndexName: createdAtIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()
  console.log('Query result: ', result)

  const items = result.Items
  console.log('Retrieved items: ', items)

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