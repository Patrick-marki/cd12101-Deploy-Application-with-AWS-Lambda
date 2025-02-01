import { getTodoById, createTodo, updateTodo, deleteTodo, getAllTodos, updateAttachmentUrl } from '../dataLayer/todosAccess.mjs'
import { getUploadUrl, deleteAttachment } from '../fileStorage/attachmentUtils.mjs'
import { v4 as uuidv4 } from 'uuid'

export async function createTodoItem(userId, newTodo) {
  const todoId = uuidv4()
  const todo = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    ...newTodo,
    attachmentUrl: ''
  }

  await createTodo(todo)
  return todo
}

export async function getTodosForUser(userId) {
  return await getAllTodos(userId)
}

export async function updateTodoItem(userId, todoId, updatedTodo) {
  return await updateTodo(userId, todoId, updatedTodo)
}

export async function updateAttachmentUrlForTodo(userId, todoId, attachmentUrl) {
  const updatedTodo = await updateAttachmentUrl(userId, todoId, attachmentUrl)
  return updatedTodo
}

export async function deleteTodoItem(userId, todoId) {
  const item = await getTodoById(userId, todoId)
  if (!item) {
    throw new Error('Todo item not found')
  }

  await deleteTodo(userId, todoId)

  if (item.attachmentUrl) {
    const key = decodeURIComponent(item.attachmentUrl.split('/').pop())
    await deleteAttachment(key)
  }
}

export function getUploadUrlForTodoItem(userId, todoId) {
  return getUploadUrl(userId, todoId)
}