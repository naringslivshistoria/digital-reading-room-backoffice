interface Field {
  id: number
  originalName: string
  value: string
}

interface Fields {
  [key: string]: Field
}

interface Page {
  pageType: string
  url: string
  thumbnailUrl: string
}

interface Document {
  id: number
  documentState: string
  fields: Fields
  pages: [Page]
}

interface User {
  id: string
  username: string
  locked: boolean
  disabled: boolean
  passwordHash: string
  salt: string
  failedLoginAttempts: number
  depositors: string | null
  archiveInitiators: string | null
  role: Role | null
}

export enum Role {
  Admin = 'Admin',
  User = 'User',
}

export { Document, Field, Fields, User }
