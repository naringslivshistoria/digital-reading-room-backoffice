import { User, UserPermissions } from '../types'

const CLIPBOARD_STORAGE_KEY = 'userPermissionsClipboard'

export const extractUserPermissions = (user: User): UserPermissions => ({
  depositors: user.depositors?.split(';').filter(Boolean) || null,
  archiveInitiators: user.archiveInitiators?.split(';').filter(Boolean) || null,
  series: user.series?.split(';').filter(Boolean) || null,
  volumes: user.volumes?.split(';').filter(Boolean) || null,
  fileNames: user.fileNames?.split(';').filter(Boolean) || null,
  groups:
    typeof user.groups === 'string'
      ? JSON.parse(user.groups || '[]')
      : Array.isArray(user.groups)
      ? user.groups
      : null,
})

export const copyUserPermissions = (user: User): void => {
  const permissionData = extractUserPermissions(user)
  localStorage.setItem(CLIPBOARD_STORAGE_KEY, JSON.stringify(permissionData))
}

export const getClipboardPermissions = (): UserPermissions | null => {
  const clipboardData = localStorage.getItem(CLIPBOARD_STORAGE_KEY)
  if (!clipboardData) return null

  try {
    return JSON.parse(clipboardData) as UserPermissions
  } catch (error) {
    console.error('Error parsing clipboard data', error)
    return null
  }
}

export const hasClipboardPermissions = (): boolean => {
  return !!localStorage.getItem(CLIPBOARD_STORAGE_KEY)
}

export const applyPermissionsToUser = (
  user: User,
  permissions: UserPermissions
): User => {
  const updatedUser = { ...user }

  const arrayFields = [
    'depositors',
    'archiveInitiators',
    'series',
    'volumes',
    'fileNames',
  ] as const

  arrayFields.forEach((field) => {
    if (permissions[field]) {
      updatedUser[field] = permissions[field]?.join(';') || ''
    }
  })

  if (permissions.groups) {
    updatedUser.groups = permissions.groups
  }

  return updatedUser
}
