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
  password: string
  locked: boolean
  disabled: boolean
  password_hash: string
  salt: string
  failedLoginAttempts: number
  depositors: string | null
  archiveInitiators: string | null
  documentIds: string | null
  role: Role | null
  groups: string | string[] | null
}

interface ImportLevel {
  id: number
  level: string
  created: Date
  crawled: Date
  error: string
  successful: number
  failed: number
  attempts: number
  batchName: string
}

interface Import {
  importName: string
  created: Date
  crawled: Date
  error: string
  successful: number
  failed: number
  attempts: number
  levels?: ImportLevel[]
}

export enum Role {
  Admin = 'Admin',
  User = 'User',
}

enum FilterType {
  freeText = 0,
  values = 1,
}

interface FieldFilterConfig {
  fieldName: string
  parentField?: string
  displayName: string
  filterType: FilterType
  values?: string[]
  allValues?: string[]
  visualSize: number
}

export {
  Document,
  Field,
  Fields,
  Import,
  ImportLevel,
  User,
  FilterType,
  FieldFilterConfig,
}
