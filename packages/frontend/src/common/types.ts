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
  notes: string | null
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
  archiveInitiatorValue: string
  onArchiveInitiatorChange: (value: string) => void
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

export enum FormSectionKey {
  depositors = 'depositors',
  archiveInitiators = 'archiveInitiators',
  series = 'series',
  volumes = 'volumes',
}

interface ItemSectionProps {
  title: string
  tooltip: string
  formStateSection: FormSectionKey
  formState: UserFormState
  handleFormChange: (
    section: FormSectionKey | keyof UserFormState,
    field: string,
    value: string
  ) => void
  handleAddItem: (type: string) => void
  handleRemoveItem: (
    type: keyof UserFormState['selectedItems'],
    itemToRemove: string
  ) => void
  depositorOptions: string[]
  section: {
    title: string
    tooltip: string
    formStateSection: keyof UserFormState
    fieldNames: string[]
  }
}

interface ItemListProps {
  items: string[]
  onDelete: (item: string) => void
}

interface UserFormState {
  depositors: string
  archiveInitiators: {
    depositor: string
    archiveInitiator: string
  }
  series: {
    depositor: string
    archiveInitiator: string
    seriesName: string
  }
  volumes: {
    depositor: string
    archiveInitiator: string
    seriesName: string
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
  selectedUsers: Set<string>
  onUserSelect: (userId: string) => void
}

interface UserToolbarProps {
  showGrid: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  onDisplayModeChange: (grid: boolean) => void
  allGroups: string[]
  selectedUsers: Set<string>
  onBatchAction: (action: string) => void
}

interface FilteredOptionsProps {
  fieldName: string
  fieldNames: string[]
  selectedItems: string[]
  currentItems: Record<string, string>
}

interface FormSection {
  depositor: string
  archiveInitiator: string
  seriesName?: string
  volume?: string
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
  FormSection,
}
