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
  id: string | undefined
  username: string | undefined
  locked: boolean
  disabled: boolean
  failedLoginAttempts: number
  depositors: string | null
  archiveInitiators: string | null
  role: Role | null
}

export enum Role {
  Admin = 'Admin',
  User = 'User',
}

export type { Document, Field, Fields, User }
