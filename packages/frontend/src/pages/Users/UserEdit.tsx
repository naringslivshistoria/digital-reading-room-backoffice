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
} from '@mui/material'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import { useIsLoggedIn } from '../../common/hooks/useIsLoggedIn'
import { useUpdateUser } from './hooks/useUser'
import { Role, User, UserFormState } from '../../common/types'
import { useFieldValues } from './hooks/useFilters'
import { ItemSelector } from './components/ItemSelector'
import { ItemList } from './components/ItemList'

export const UserEdit = () => {
  useIsLoggedIn()
  const { data: filterConfigs } = useFieldValues({ filter: null })
  const location = useLocation()
  const navigate = useNavigate()
  const updateUser = useUpdateUser()
  const [editUser, setEditUser] = useState<User>(location.state.user)
  const [error, setError] = useState<string | null>()
  const [showDepositors, setShowDepositors] = useState(false)
  const [showArchiveInitiators, setShowArchiveInitiators] = useState(false)
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
  const expandedGroup = location.state.expandedGroup

  const addDepositor = (depositor: string) => {
    if (editUser.depositors) {
      if (editUser.depositors.indexOf(depositor) !== -1) {
        return
      }
    }

    const updatedUser = { ...editUser }
    if (updatedUser.depositors) {
      updatedUser.depositors += ';' + depositor
    } else {
      updatedUser.depositors = depositor
    }

    setEditUser(updatedUser)
    setSeriesList(newValue)
  }

  const handleDepositorsChange = (event: any, newValue: string[]) => {
    const updatedUser = { ...editUser, depositors: newValue.join(';') }
    setEditUser(updatedUser)
    setSelectedDepositors(newValue)
  }

  const handleArchiveInitiatorsChange = (event: any, newValue: string[]) => {
    const updatedUser = { ...editUser, archiveInitiators: newValue.join(';') }
    setEditUser(updatedUser)
    setSelectedArchiveInitiators(newValue)
  }

  const saveUser = async () => {
    if (editUser) {
      setError(null)
      try {
        const userToSave = {
          ...editUser,
          groups:
            typeof editUser.groups === 'string'
              ? editUser.groups
              : JSON.stringify(editUser.groups),
        }
        await updateUser.mutateAsync(userToSave)
        navigate('/users')
      } catch (axiosError: any) {
        setError(axiosError.response.data.error)
      }
    }
  }

  const handleGroupsChange = (event: any, newValue: string[]) => {
    const validGroups = newValue
      .filter((group) => typeof group === 'string' && group.trim().length > 0)
      .map((group) => group.trim())
    setSelectedGroups(validGroups)
    const updatedUser = { ...editUser }
    updatedUser.groups = JSON.stringify(validGroups)
    setEditUser(updatedUser)
  }

  return (
    editUser && (
      <>
        <Grid item md={10} xs={10}>
          <Box sx={{ marginTop: 3, marginBottom: 2 }}>
            <Link
              to="/users"
              state={{ expandedGroup, showGrid: location.state.showGrid }}
            >
              <ChevronLeftIcon sx={{ marginTop: '-2px' }} /> Användare
            </Link>
          </Box>
          <Divider sx={{ borderColor: 'red', marginBottom: '20px' }} />
          <Typography variant="h2">Administrera användare</Typography>
          <Grid
            container
            columnSpacing={4}
            rowSpacing={4}
            sx={{ marginTop: 0, marginBottom: '40px' }}
          >
            <Grid item md={7} xs={12}>
              <TextField
                id="username"
                label="Användarnamn (epostadress)"
                variant="outlined"
                value={editUser.username}
                onChange={(event) =>
                  setEditUser({ ...editUser, username: event.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item md={5} xs={12}>
              Användarnamnet är epostadressen
            </Grid>
            <Grid item md={7} xs={12}>
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
            <Grid item md={5} xs={12}>
              Användare av typen Administratör kan både logga in i backoffice
              och i läsesalen. Vanliga användare kan bara logga in i läsesalen.
            </Grid>
            <Grid item md={7} xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={allGroups || []}
                value={selectedGroups}
                onChange={(event, newValue) =>
                  handleGroupsChange(event, newValue)
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                  }
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
                    label="Skriv in grupper och tryck Enter"
                    placeholder="Skriv grupp..."
                  />
                )}
                fullWidth
                noOptionsText="Skriv in grupp och tryck Enter"
              />
            </Grid>
            <Grid item md={5} xs={12}>
              Grupper som användaren tillhör. Tryck enter för att spara.
            </Grid>
            <Grid item md={7} xs={12}>
              <TextField
                id="depositors"
                label="Deponenter"
                variant="outlined"
                multiline
                rows={4}
                value={editUser.depositors ?? undefined}
                onChange={(event) => {
                  const updatedUser = {
                    ...editUser,
                  }
                  updatedUser.depositors = event.target.value.replaceAll(
                    '\n',
                    ''
                  )
                  setEditUser(updatedUser)
                }}
                fullWidth
                disableCloseOnSelect
                noOptionsText="Inga deponenter hittades"
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <p>
                Ange de deponenter användaren ska kunna se i läsesalen. Allt
                material för en deponent som anges här kommer vara åtkomligt för
                användaren.
              </p>
            </Grid>
            <Grid item md={7} xs={12}>
              <ItemSelector
                depositorValue={formState.archiveInitiators.depositor}
                onDepositorChange={(value) =>
                  handleFormChange('archiveInitiators', 'depositor', value)
                }
                archiveValue={formState.archiveInitiators.archive}
                onArchiveChange={(value) =>
                  handleFormChange('archiveInitiators', 'archive', value)
                }
                depositorOptions={depositorOptions}
                archiveOptions={archiveOptions}
                onAdd={() => handleAddItem('archiveInitiators')}
                disabled={
                  !formState.archiveInitiators.depositor ||
                  !formState.archiveInitiators.archive
                }
              />
              <ItemList
                items={formState.selectedItems.archiveInitiators}
                onDelete={(item) => handleRemoveItem('archiveInitiators', item)}
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <p>
                Ange de arkivbildare användaren ska kunna se i läsesalen. Allt
                material för en arkivbildare som anges här kommer vara åtkomligt
                för användaren.
              </p>
            </Grid>
            <Grid item md={7} xs={12}>
              <ItemSelector
                depositorValue={formState.series.depositor}
                onDepositorChange={(value) =>
                  handleFormChange('series', 'depositor', value)
                }
                archiveValue={formState.series.archive}
                onArchiveChange={(value) =>
                  handleFormChange('series', 'archive', value)
                }
                seriesValue={formState.series.series}
                onSeriesChange={(value) =>
                  handleFormChange('series', 'series', value)
                }
                depositorOptions={depositorOptions}
                archiveOptions={archiveOptions}
                seriesOptions={seriesOptions}
                onAdd={() => handleAddItem('series')}
                disabled={
                  !formState.series.depositor ||
                  !formState.series.archive ||
                  !formState.series.series
                }
              />
              <ItemList
                items={formState.selectedItems.series}
                onDelete={(item) => handleRemoveItem('series', item)}
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <p>
                Ange de serier användaren ska kunna se i läsesalen. Välj först
                en deponent och ett arkiv, skriv sedan in serienamnet. Tryck
                Enter för att lägga till serien.
              </p>
            </Grid>
            <Grid item md={7} xs={12}>
              <ItemSelector
                depositorValue={formState.volumes.depositor}
                onDepositorChange={(value) =>
                  handleFormChange('volumes', 'depositor', value)
                }
                archiveValue={formState.volumes.archive}
                onArchiveChange={(value) =>
                  handleFormChange('volumes', 'archive', value)
                }
                seriesValue={formState.volumes.series}
                onSeriesChange={(value) =>
                  handleFormChange('volumes', 'series', value)
                }
                volumeValue={formState.volumes.volume}
                onVolumeChange={(value) =>
                  handleFormChange('volumes', 'volume', value)
                }
                depositorOptions={depositorOptions}
                archiveOptions={archiveOptions}
                seriesOptions={seriesOptions}
                volumeOptions={volumeOptions}
                onAdd={() => handleAddItem('volumes')}
                disabled={
                  !formState.volumes.depositor ||
                  !formState.volumes.archive ||
                  !formState.volumes.series ||
                  !formState.volumes.volume
                }
              />
              <ItemList
                items={formState.selectedItems.volumes}
                onDelete={(item) => handleRemoveItem('volumes', item)}
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <p>
                Ange de volymer användaren ska kunna se i läsesalen. Välj först
                en deponent, ett arkiv och en serie, skriv sedan in volymnamnet.
                Tryck Enter för att lägga till volymen.
              </p>
            </Grid>
            <Grid item md={7} xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={formState.selectedItems.fileNames}
                onChange={(event, newValue) => handleFileNamesChange(newValue)}
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
                    label="Lägg till dokument"
                    placeholder="Skriv filnamn och tryck Enter..."
                  />
                )}
                fullWidth
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <p>
                Ange filnamn för de dokument användaren ska kunna se i
                läsesalen. Skriv in filnamnet och tryck Enter för att lägga till
                det.
              </p>
            </Grid>
            <Grid item md={7} xs={12}>
              <FormControlLabel
                control={<Checkbox id="locked" />}
                label="Låst"
                checked={editUser.locked}
                onChange={(event, checked: boolean) =>
                  setEditUser({ ...editUser, locked: checked })
                }
              />
              <FormControlLabel
                control={<Checkbox id="disabled" />}
                label="Avstängt"
                checked={editUser.disabled}
                onChange={(event, checked: boolean) =>
                  setEditUser({ ...editUser, disabled: checked })
                }
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <p>
                Efter tre misslyckade inloggningsförsök markeras kontot
                automatiskt som låst, och kan då inte användas för inloggning.
                Om ett konto är avstängt så har det låsts manuellt av en
                administratör.
              </p>
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
      </>
    )
  )
}
