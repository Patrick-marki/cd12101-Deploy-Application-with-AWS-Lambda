import { getUserId } from '../utils.mjs'
import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})
const bucketName = process.env.ATTACHMENTS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler = async (event) => {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const url = getUploadUrl(userId, todoId)

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

function getUploadUrl(userId, todoId) {
  const key = `${userId}_${todoId}`
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: key,
    Expires: parseInt(urlExpiration)
  })
}