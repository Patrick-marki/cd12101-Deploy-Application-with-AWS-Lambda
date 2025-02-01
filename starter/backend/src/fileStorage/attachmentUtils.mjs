import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})
const bucketName = process.env.ATTACHMENTS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export function getUploadUrl(userId, todoId) {
  const key = `${userId}_${todoId}`
  console.log('Generating upload URL for key:', key)
  const url = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: key,
    Expires: parseInt(urlExpiration)
  })
  console.log('Generated upload URL:', url)
  return url
}

export async function deleteAttachment(key) {
  console.log('Deleting attachment with key:', key)
  await s3.deleteObject({
    Bucket: bucketName,
    Key: key
  }).promise()
  console.log('Attachment deleted:', key)
}