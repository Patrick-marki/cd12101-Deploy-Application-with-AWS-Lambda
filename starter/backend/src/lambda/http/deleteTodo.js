import { getUserId } from '../utils.mjs'
import AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3()
const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.ATTACHMENTS_S3_BUCKET

export const handler = async (event) => {
  console.log('Processing event: ', event)

  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  console.log(`Fetching todo item with id ${todoId} for user ${userId}`)
  const result = await docClient.get({
    TableName: todosTable,
    Key: {
      userId,
      todoId
    }
  }).promise()

  const item = result.Item

  if (!item) {
    console.log(`Todo item with id ${todoId} does not exist for user ${userId}`)
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Todo item does not exist'
      })
    }
  }

  console.log(`Deleting todo item with id ${todoId} for user ${userId}`)
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

  if (item.attachmentUrl) {
    const key = decodeURIComponent(item.attachmentUrl.split('/').pop())
    console.log(`Deleting attachment from S3 bucket ${bucketName} with key ${key}`)
    await s3.deleteObject({
      Bucket: bucketName,
      Key: key
    }).promise()
  } else {
    console.log(`No attachment URL found for todo item with id ${todoId}`)
  }

  console.log(`Successfully deleted todo item with id ${todoId} for user ${userId}`)
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}

