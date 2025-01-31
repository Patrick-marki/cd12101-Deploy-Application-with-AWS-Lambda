import AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.ATTACHMENTS_S3_BUCKET

export const handler = async (event) => {
  for (const record of event.Records) {
    const key = decodeURIComponent(record.s3.object.key)
    const [userId, todoId] = key.split('_') // Assuming the key is in the format userId_todoId
    console.log('Processing S3 item with key:', key)
    console.log('userId:', userId)
    console.log('todoId:', todoId)

    if (record.eventName === 'ObjectRemoved:Delete') {
      console.log('Removing attachmentUrl from todo:', todoId)
      await docClient.update({
        TableName: todosTable,
        Key: {
          userId,
          todoId
        },
        UpdateExpression: 'remove attachmentUrl'
      }).promise()
      
    } else if (record.eventName === 'ObjectCreated:Put') {
      const url = `https://${bucketName}.s3.amazonaws.com/${encodeURIComponent(key)}`
      console.log('Updating attachmentUrl for todo:', todoId)
      await docClient.update({
        TableName: todosTable,
        Key: {
          userId,
          todoId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': url
        }
      }).promise()
    }
  }
}