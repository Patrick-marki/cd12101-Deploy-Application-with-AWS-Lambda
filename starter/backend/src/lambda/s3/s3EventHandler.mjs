import { updateAttachmentUrlForTodo } from '../../businessLogic/todos.mjs'

export const handler = async (event) => {
  console.log('Processing S3 event: ', event)
  for (const record of event.Records) {
    const key = decodeURIComponent(record.s3.object.key)
    const [userId, todoId] = key.split('_') // Assuming the key is in the format userId_todoId

    console.log('Processing S3 item with key:', key)
    console.log('userId:', userId)
    console.log('todoId:', todoId)

    if (record.eventName === 'ObjectRemoved:Delete') {
      console.log('Removing attachmentUrl from todo:', todoId)
      await updateAttachmentUrlForTodo(userId, todoId, '')
      console.log('Attachment URL removed for todo:', todoId)
    } else if (record.eventName === 'ObjectCreated:Put') {
      const url = `https://${process.env.ATTACHMENTS_S3_BUCKET}.s3.amazonaws.com/${key}`
      console.log('Updating attachmentUrl for todo:', todoId)
      await updateAttachmentUrlForTodo(userId, todoId, url)
      console.log('Attachment URL updated for todo:', todoId)
    }
  }
}