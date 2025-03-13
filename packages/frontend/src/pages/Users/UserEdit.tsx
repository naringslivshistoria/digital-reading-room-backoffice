import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Autocomplete,
  Chip,
  Tooltip,
  IconButton,
  InputAdornment,
  Snackbar,
} from '@mui/material'
import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import InfoIcon from '@mui/icons-material/Info'
import Password from '@mui/icons-material/Password'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'

import { useIsLoggedIn } from '../../common/hooks/useIsLoggedIn'
import { useUpdateUser } from './hooks/useUser'
import {
  Role,
  User,
  UserFormState,
  FormSection,
  FormSectionKey,
  UserPermissions,
} from '../../common/types'
import { ItemSection } from './components/ItemSection'
import { useFieldOptions } from './hooks/useFieldOptions'
import {
  copyUserPermissions,
  getClipboardPermissions,
  hasClipboardPermissions,
} from '../../common/util/userPermissionsClipboard'

export const UserEdit = () => {
  useIsLoggedIn()
  const location = useLocation()
  const navigate = useNavigate()
  const updateUser = useUpdateUser()
  const [editUser, setEditUser] = useState<User>(location.state.user)
  const [error, setError] = useState<string | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const [formState, setFormState] = useState<UserFormState>({
    depositors: '',
    archiveInitiators: { depositor: '', archiveInitiator: '' },
    series: { depositor: '', archiveInitiator: '', seriesName: '' },
    volumes: {
      depositor: '',
      archiveInitiator: '',
      seriesName: '',
      volume: '',
    },
    selectedItems: {
      depositors:
        location.state.user.depositors?.split(';').filter(Boolean) || [],
      archiveInitiators:
        location.state.user.archiveInitiators?.split(';').filter(Boolean) || [],
      series: location.state.user.series?.split(';').filter(Boolean) || [],
      volumes: location.state.user.volumes?.split(';').filter(Boolean) || [],
      fileNames:
        location.state.user.fileNames?.split(';').filter(Boolean) || [],
    },
  })

  const allGroups = location.state.allGroups
  const [selectedGroups, setSelectedGroups] = useState<string[]>(() => {
    const userGroups = location.state.user.groups
    if (!userGroups) {
      return []
    }

    if (typeof userGroups === 'string') {
      try {
        return JSON.parse(userGroups)
      } catch {
        return []
      }
    }

    return Array.isArray(userGroups) ? userGroups : []
  })
  const [formErrors, setFormErrors] = useState({
    username: '',
    password: '',
  })

  const handleFormChange = (
    section: keyof UserFormState,
    field: string,
    value: string
  ) => {
    const sectionDef = sections.find((s) => s.formStateSection === section)
    if (sectionDef && typeof formState[section] === 'object') {
      const fieldIndex = sectionDef.fieldNames.indexOf(field)
      setFormState((prev) => {
        const newSectionState = { ...(prev[section] as Record<string, string>) }
        newSectionState[field] = value
        for (let i = fieldIndex + 1; i < sectionDef.fieldNames.length; i++) {
          const f = sectionDef.fieldNames[i]
          newSectionState[f] = ''
        }
        return { ...prev, [section]: newSectionState }
      })
    } else {
      setFormState((prev) => ({ ...prev, [section]: value }))
    }
  }

  const handleAddItem = (type: string) => {
    let fields: string[] = []

    if (type === 'depositors') {
      if (!formState.depositors) return
      fields = [formState.depositors]
      if (formState.selectedItems.depositors.includes(fields[0])) return
    } else {
      const values = Object.values(formState[type as keyof UserFormState])
      if (values.some((value) => !value)) return
      fields = values as string[]
      const newItem = fields.join('>')
      if (
        formState.selectedItems[
          type as keyof UserFormState['selectedItems']
        ].includes(newItem)
      )
        return
    }

    const newItem = fields.join('>')
    const updatedItems = [
      ...formState.selectedItems[type as keyof UserFormState['selectedItems']],
      newItem,
    ]

    setFormState((prev) => {
      let newSectionState: (typeof prev)[keyof UserFormState] =
        prev[type as keyof UserFormState]
      if (type !== 'depositors') {
        const section = sections.find((s) => s.formStateSection === type)
        if (section) {
          const lastField = section.fieldNames[section.fieldNames.length - 1]
          newSectionState = {
            ...(prev[type as keyof UserFormState] as FormSection),
            [lastField]: '',
          } as (typeof prev)[keyof UserFormState]
        }
      } else {
        newSectionState = ''
      }

      return {
        ...prev,
        selectedItems: {
          ...prev.selectedItems,
          [type]: updatedItems,
        },
        [type]: newSectionState,
      }
    })

    setEditUser((prev) => ({
      ...prev,
      [type]: updatedItems.join(';'),
    }))
  }

  const handleRemoveItem = (
    type: keyof UserFormState['selectedItems'],
    itemToRemove: string
  ) => {
    const updatedItems = formState.selectedItems[type].filter(
      (item) => item !== itemToRemove
    )
    setFormState((prev) => ({
      ...prev,
      selectedItems: {
        ...prev.selectedItems,
        [type]: updatedItems,
      },
    }))
    setEditUser((prev) => ({
      ...prev,
      [type]: updatedItems.join(';'),
    }))
  }

  const handleFileNamesChange = (newValue: string[]) => {
    setFormState((prev) => ({
      ...prev,
      selectedItems: {
        ...prev.selectedItems,
        fileNames: newValue,
      },
    }))
    setEditUser((prev) => ({
      ...prev,
      fileNames: newValue.join(';'),
    }))
  }

  const validateForm = () => {
    const errors = {
      username: '',
      password: '',
    }

    if (!editUser.username?.trim()) {
      errors.username = 'Användarnamn måste anges'
    }

    if (!editUser.password?.trim() && isNewUser) {
      errors.password = 'Lösenord måste anges'
    } else if (editUser.password && editUser.password.length < 8) {
      errors.password = 'Lösenord måste vara minst 8 tecken långt'
    }

    setFormErrors(errors)
    return !Object.values(errors).some((error) => error)
  }

  const saveUser = async () => {
    if (editUser) {
      setError(null)

      if (!validateForm()) {
        console.log('form errors', formErrors)
        return
      }

      try {
        const userToSave = {
          ...editUser,
          groups: Array.isArray(editUser.groups)
            ? JSON.stringify(editUser.groups)
            : editUser.groups,
        }
        await updateUser.mutateAsync(userToSave)
        navigate('/users')
      } catch (axiosError: any) {
        setError(axiosError.response.data.error)
      }
    }
  }

  const depositorOptions = useFieldOptions('depositor')

  const handleGroupsChange = (event: any, newValue: string[]) => {
    const validGroups = newValue
      .filter(Boolean)
      .map((group) => group.trim())
      .filter((group) => group.length > 0)

    setSelectedGroups(validGroups)
    setEditUser((prev) => ({
      ...prev,
      groups: validGroups,
    }))
  }

  const sections = [
    {
      title: 'Arkivbildare',
      tooltip:
        'Ange arkivbildare användaren ska kunna se i läsesalen. Allt material för en arkivbildare som anges här kommer vara åtkomligt för användaren.',
      formStateSection: FormSectionKey.archiveInitiators,
      fieldNames: ['depositor', 'archiveInitiator'],
    },
    {
      title: 'Serier',
      tooltip:
        'Ange serier användaren ska kunna se i läsesalen. Välj först en deponent och ett arkiv, skriv sedan in serienamnet. Tryck Enter för att lägga till serien.',
      formStateSection: FormSectionKey.series,
      fieldNames: ['depositor', 'archiveInitiator', 'seriesName'],
    },
    {
      title: 'Volymer',
      tooltip:
        'Ange volymer användaren ska kunna se i läsesalen. Välj först en deponent, ett arkiv och en serie, skriv sedan in volymnamnet. Tryck Enter för att lägga till volymen.',
      formStateSection: FormSectionKey.volumes,
      fieldNames: ['depositor', 'archiveInitiator', 'seriesName', 'volume'],
    },
  ]

  const generatePassword = () => {
    const newPassword = Math.random().toString(36).slice(-8)
    setEditUser((prev) => ({ ...prev, password: newPassword }))
  }

  const isNewUser = !location.state?.user?.username

  const handleCopyPermissions = useCallback(() => {
    copyUserPermissions(editUser)
    setSnackbarMessage('Användarens rättigheter har kopierats')
    setSnackbarOpen(true)
  }, [editUser])

  const applyPermissions = useCallback(
    (permissions: UserPermissions) => {
      const updatedUser = { ...editUser }
      const updatedFormItems = { ...formState.selectedItems }

      const permissionTypes: (keyof UserPermissions &
        keyof typeof updatedFormItems)[] = [
        'depositors',
        'archiveInitiators',
        'series',
        'volumes',
        'fileNames',
      ]

      permissionTypes.forEach((type) => {
        if (permissions[type]) {
          updatedUser[type] = permissions[type]?.join(';') || null
          updatedFormItems[type] = permissions[type] || []
        }
      })

      if (permissions.groups) {
        updatedUser.groups = permissions.groups
        setSelectedGroups(permissions.groups)
      }

      setEditUser(updatedUser)
      setFormState((prev) => ({
        ...prev,
        selectedItems: updatedFormItems,
      }))

      setSnackbarMessage(
        'Rättigheter har klistrats in. Klicka på Spara för att bekräfta ändringarna.'
      )
      setSnackbarOpen(true)
    },
    [editUser, formState.selectedItems]
  )

  const handlePastePermissions = useCallback(() => {
    const permissions = getClipboardPermissions()
    if (!permissions) {
      setSnackbarMessage('Inga kopierade rättigheter att klistra in')
      setSnackbarOpen(true)
      return
    }

    applyPermissions(permissions)
  }, [applyPermissions])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement
      ) {
        return
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v')) {
        e.preventDefault()
        e.key === 'c' ? handleCopyPermissions() : handlePastePermissions()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleCopyPermissions, handlePastePermissions])

  const handleSnackbarClose = () => setSnackbarOpen(false)

  const clipboardHasPermissions = hasClipboardPermissions()

  return (
    editUser && (
      <>
        <Grid item md={10} xs={10}>
          <Box sx={{ marginTop: 3, marginBottom: 2 }}>
            <Link
              to="/users"
              state={{
                expandedGroup: location.state.expandedGroup,
                showGrid: location.state.showGrid,
              }}
            >
              <ChevronLeftIcon sx={{ marginTop: '-2px' }} /> Användare
            </Link>
          </Box>
          <Divider sx={{ borderColor: 'red', marginBottom: '20px' }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h2">
              {isNewUser ? 'Skapa användare' : 'Administrera användare'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Kopiera rättigheter (Ctrl+C / Cmd+C)" arrow>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={handleCopyPermissions}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Klistra in rättigheter (Ctrl+V / Cmd+V)" arrow>
                <span>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={handlePastePermissions}
                    disabled={!clipboardHasPermissions}
                  >
                    <ContentPasteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
          <Grid
            container
            columnSpacing={4}
            rowSpacing={4}
            sx={{ marginTop: 0, marginBottom: '40px' }}
          >
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Typography variant="h3">Användare</Typography>
              <Tooltip
                title="Användarnamnet är epostadressen, användare av typen Administratör kan både logga in i backoffice och i läsesalen. Vanliga användare kan bara logga in i läsesalen. "
                placement="right"
              >
                <InfoIcon color="action" />
              </Tooltip>
            </Grid>
            <Grid item xs={5}>
              <TextField
                id="username"
                label="Användarnamn (epostadress)"
                variant="outlined"
                value={editUser.username}
                onChange={(event) =>
                  setEditUser({ ...editUser, username: event.target.value })
                }
                error={!!formErrors.username}
                helperText={formErrors.username}
                fullWidth
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                id="password"
                label={isNewUser ? 'Ange lösenord' : 'Ange nytt lösenord'}
                variant="outlined"
                value={editUser.password}
                onChange={(event) =>
                  setEditUser({ ...editUser, password: event.target.value })
                }
                error={!!formErrors.password}
                helperText={formErrors.password}
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={generatePassword}>
                        <Password />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Användartyp</InputLabel>
                <Select
                  labelId="role-label"
                  label="Användartyp"
                  value={editUser.role}
                  onChange={(event) =>
                    setEditUser({
                      ...editUser,
                      role: event.target.value as Role,
                    })
                  }
                >
                  <MenuItem value="User">Standard</MenuItem>
                  <MenuItem value="Admin">Administratör</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Typography variant="h3">Grupper</Typography>
              <Tooltip
                title="Grupper som användaren tillhör. Tryck enter för att spara."
                placement="right"
              >
                <InfoIcon color="action" />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                clearOnBlur
                selectOnFocus
                options={allGroups || []}
                value={selectedGroups}
                onChange={(event, newValue) => {
                  if (newValue.length < selectedGroups.length) {
                    handleGroupsChange(null, newValue)
                    return
                  }

                  const lastValue = newValue[newValue.length - 1]
                  if (lastValue?.trim().length > 1) {
                    const validGroups = newValue
                      .filter(Boolean)
                      .map((group) => group.trim())
                      .filter((group) => group.length > 1)
                    handleGroupsChange(null, validGroups)
                  }
                }}
                onBlur={(event) => {
                  const inputValue = (event.target as HTMLInputElement).value
                  if (inputValue?.trim().length > 1) {
                    const validGroups = [
                      ...selectedGroups.filter((g) => g !== inputValue),
                      inputValue.trim(),
                    ]
                    handleGroupsChange(null, validGroups)
                  }
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option, index) => (
                    // eslint-disable-next-line react/jsx-key
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Välj eller skapa grupper"
                    placeholder="Skriv grupp..."
                  />
                )}
                fullWidth
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Typography variant="h3">Deponenter</Typography>
              <Tooltip
                title="Ange deponenter användaren ska kunna se i läsesalen. Allt material för en deponent som anges här kommer vara åtkomligt för användaren."
                placement="right"
              >
                <InfoIcon color="action" />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={depositorOptions.filter(
                  (value) => !formState.selectedItems.depositors.includes(value)
                )}
                value={formState.selectedItems.depositors || null}
                onChange={(event, newValue) => {
                  setFormState((prev) => ({
                    ...prev,
                    selectedItems: {
                      ...prev.selectedItems,
                      depositors: newValue,
                    },
                    depositors: '',
                  }))
                  setEditUser((prev) => ({
                    ...prev,
                    depositors: newValue.join(';'),
                  }))
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option, index) => (
                    // eslint-disable-next-line react/jsx-key
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      onDelete={() => handleRemoveItem('depositors', option)}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Lägg till deponenter genom att söka och klicka"
                    placeholder="Sök deponenter..."
                  />
                )}
                fullWidth
                disableCloseOnSelect
                noOptionsText="Inga deponenter hittades"
              />
            </Grid>
            {sections.map((section) => {
              return (
                <ItemSection
                  key={section.title}
                  title={section.title}
                  tooltip={section.tooltip}
                  formStateSection={section.formStateSection}
                  formState={formState}
                  handleFormChange={handleFormChange}
                  handleAddItem={handleAddItem}
                  handleRemoveItem={handleRemoveItem}
                  depositorOptions={depositorOptions}
                  section={section}
                />
              )
            })}
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Typography variant="h3">Filnamn</Typography>
              <Tooltip
                title="Ange filnamn för de dokument användaren ska kunna se i läsesalen. Skriv in filnamnet och tryck Enter för att lägga till det."
                placement="right"
              >
                <InfoIcon color="action" />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                clearOnBlur
                selectOnFocus
                options={[]}
                value={formState.selectedItems.fileNames}
                onChange={(event, newValue) => {
                  if (
                    newValue.length < formState.selectedItems.fileNames.length
                  ) {
                    handleFileNamesChange(newValue)
                    return
                  }

                  const lastValue = newValue[newValue.length - 1]
                  if (lastValue?.trim().length > 1) {
                    handleFileNamesChange(newValue)
                  }
                }}
                onBlur={(event) => {
                  const inputValue = (event.target as HTMLInputElement).value
                  if (inputValue?.trim().length > 1) {
                    handleFileNamesChange([
                      ...formState.selectedItems.fileNames,
                      inputValue.trim(),
                    ])
                  }
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option, index) => (
                    // eslint-disable-next-line react/jsx-key
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Lägg till filer"
                    placeholder="Skriv filnamn..."
                  />
                )}
                fullWidth
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Typography variant="h3">Anteckningar</Typography>
              <Tooltip title="Anteckningar om användaren." placement="right">
                <InfoIcon color="action" />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="notes"
                label="Anteckningar"
                variant="outlined"
                value={editUser.notes}
                onChange={(event) =>
                  setEditUser({ ...editUser, notes: event.target.value })
                }
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Typography variant="h3">Status</Typography>
              <Tooltip
                title="Efter tre misslyckade inloggningsförsök markeras kontot automatiskt som låst, och kan då inte användas för inloggning. Om ett konto är avstängt så har det låsts manuellt av en administratör."
                placement="right"
              >
                <InfoIcon color="action" />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FormControlLabel
                  control={<Checkbox id="locked" />}
                  label="Låst"
                  checked={editUser.locked}
                  onChange={(event, checked: boolean) =>
                    setEditUser({ ...editUser, locked: checked })
                  }
                  sx={{ width: '100%' }}
                />
                <FormControlLabel
                  control={<Checkbox id="disabled" />}
                  label="Avstängt"
                  checked={editUser.disabled}
                  onChange={(event, checked: boolean) =>
                    setEditUser({ ...editUser, disabled: checked })
                  }
                  sx={{ width: '100%' }}
                />
              </Box>
            </Grid>
            <Grid item md={12} xs={12}>
              {error && <Alert severity="error">{error}</Alert>}
            </Grid>
            <Grid item md={12} xs={12}>
              <Button onClick={saveUser} variant="contained">
                Spara
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        />
      </>
    )
  )
}
