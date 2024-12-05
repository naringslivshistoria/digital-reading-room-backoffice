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
  passwordHash: string
  salt: string
  failedLoginAttempts: number
  depositors: string | null
  archiveInitiators: string | null
  documentIds: string | null
  fileNames: string | null
  role: Role | null
  volumes: string | null
  series: string | null
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

interface ItemSelectorProps {
  depositorValue: string
  onDepositorChange: (value: string) => void
  archiveValue: string
  onArchiveChange: (value: string) => void
  depositorOptions: string[]
  archiveOptions: string[]
  seriesOptions?: string[]
  seriesValue?: string
  onSeriesChange?: (value: string) => void
  volumeOptions?: string[]
  volumeValue?: string
  onVolumeChange?: (value: string) => void
  onAdd: () => void
  disabled?: boolean
}

interface ItemSectionProps {
  title: string
  tooltip: string
  formStateSection: keyof UserFormState
  formState: UserFormState
  handleFormChange: (
    section: keyof UserFormState,
    field: string,
    value: string
  ) => void
  handleAddItem: (type: keyof UserFormState) => void
  handleRemoveItem: (type: keyof UserFormState, itemToRemove: string) => void
  section: {
    fieldNames: string[]
  }
  depositorOptions: string[]
}

interface ItemListProps {
  items: string[]
  onDelete: (item: string) => void
}

interface UserFormState {
  depositors: string
  archiveInitiators: {
    depositor: string
    archive: string
  }
  series: {
    depositor: string
    archive: string
    series: string
  }
  volumes: {
    depositor: string
    archive: string
    series: string
    volume: string
  }
  selectedItems: {
    depositors: string[]
    archiveInitiators: string[]
    series: string[]
    volumes: string[]
    fileNames: string[]
  }
}

type ColumnConfig = {
  id: keyof User
  label: string
  align?: 'left' | 'right'
  minWidth?: number
  hideOnMobile?: boolean
}

interface UserTableProps {
  users: User[]
  availableColumns: ColumnConfig[]
  page: number
  rowsPerPage: number
  group?: string
  pageByGroup?: { [key: string]: number }
  handleGroupClick: (group: string, event: React.MouseEvent) => void
  handleChangePage: (event: unknown, newPage: number) => void
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
  deleteUser: (user: User) => void
  showGrid: boolean
  expandedGroup: string | null
  allGroups: string[]
}

interface UserToolbarProps {
  showGrid: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  onDisplayModeChange: (grid: boolean) => void
  allGroups: string[]
}

interface FilteredOptionsProps {
  fieldName: string
  filterFieldName: string
  filterValue: string | undefined
  selectedItems: string[]
  levelIndex: number
  currentValue: string
}

export type {
  Document,
  Field,
  Fields,
  Import,
  ImportLevel,
  User,
  ColumnConfig,
  ItemSelectorProps,
  ItemSectionProps,
  ItemListProps,
  UserFormState,
  UserTableProps,
  UserToolbarProps,
  FilteredOptionsProps,
}
