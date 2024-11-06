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
import { Role, User } from '../../common/types'
import { useFieldValues } from './hooks/useFilters'

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
  const [selectedGroups, setSelectedGroups] = useState<string[] | null>(
    location.state.user.groups || []
  )
  const expandedGroup = location.state.expandedGroup
  console.log(location.state.user.groups)
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
  }

  const addArchiveInitiator = (archiveInitiator: string) => {
    if (editUser.archiveInitiators) {
      if (editUser.archiveInitiators.indexOf(archiveInitiator) !== -1) {
        return
      }
    }

    const updatedUser = { ...editUser }
    if (updatedUser.archiveInitiators) {
      updatedUser.archiveInitiators += ';' + archiveInitiator
    } else {
      updatedUser.archiveInitiators = archiveInitiator
    }

    setEditUser(updatedUser)
  }

  const saveUser = async () => {
    if (editUser) {
      setError(null)
      try {
        await updateUser.mutateAsync(editUser)
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
            spacing={4}
            sx={{ marginTop: 0, marginBottom: '40px' }}
          >
            <Grid item md={7} xs={12}>
              <TextField
                id="username"
                label="Användarnamn (epostadress)"
                variant="outlined"
                value={editUser.username}
                onChange={(event) => {
                  const updatedUser = {
                    ...editUser,
                  }
                  updatedUser.username = event.target.value
                  setEditUser(updatedUser)
                }}
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
                  onChange={(event) => {
                    const updatedUser = {
                      ...editUser,
                    }
                    updatedUser.role = event.target.value as Role
                    setEditUser(updatedUser)
                  }}
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
                options={[]}
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
                    label="Skriv in grupper och tryck Enter"
                    placeholder="Skriv grupp..."
                  />
                )}
                fullWidth
                noOptionsText="Skriv in grupp och tryck Enter"
              />
            </Grid>
            <Grid item md={5} xs={12}>
              Grupper som användaren tillhör.
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
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <p>
                Ange de deponenter användaren ska kunna se i läsesalen. Allt
                material för en deponent som anges här kommer vara åtkomligt för
                användaren. Ange flera deponenter med semikolon mellan.
                Exempelvis:
                <br />
                <i>
                  Deponent1;
                  <br />
                  Deponent2;
                </i>
              </p>
              <div>
                <button onClick={() => setShowDepositors(!showDepositors)}>
                  <b>Visa tillgängliga deponenter</b>
                </button>
                {showDepositors && (
                  <Box
                    sx={{
                      maxHeight: 300,
                      overflow: 'scroll',
                      padding: 2,
                      border: '1px solid black',
                    }}
                  >
                    {showDepositors &&
                      filterConfigs &&
                      filterConfigs
                        .find(
                          (filterConfig) =>
                            filterConfig.fieldName === 'depositor'
                        )
                        ?.allValues?.map((value) => (
                          <Box key={value} sx={{ alignContent: 'left' }}>
                            <Button
                              sx={{ textAlign: 'left', lineHeight: 'normal' }}
                              onClick={() => {
                                addDepositor(value)
                              }}
                            >
                              {value}
                            </Button>
                          </Box>
                        ))}
                  </Box>
                )}
              </div>
            </Grid>
            <Grid item md={7} xs={12}>
              <TextField
                id="archiveInitiators"
                label="Arkiv"
                variant="outlined"
                multiline
                rows={4}
                value={editUser.archiveInitiators ?? undefined}
                onChange={(event) => {
                  const updatedUser = {
                    ...editUser,
                  }
                  updatedUser.archiveInitiators = event.target.value.replaceAll(
                    '\n',
                    ''
                  )
                  setEditUser(updatedUser)
                }}
                fullWidth
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <p>
                Ange de arkivbildare användaren ska kunna se i läsesalen. Allt
                material för en serie som anges här kommer vara åtkomligt för
                användaren. Ange flera arkivbildare med semikolon mellan.
                Exempelvis:
                <br />
                <i>
                  Deponent1&gt;Arkivbildare1;
                  <br />
                  Deponent2&gt;Arkivbildare1;
                </i>
              </p>
              <div>
                <button
                  onClick={() =>
                    setShowArchiveInitiators(!showArchiveInitiators)
                  }
                >
                  <b>Visa tillgängliga arkiv</b>
                </button>
                {showArchiveInitiators && (
                  <Box
                    sx={{
                      maxHeight: 300,
                      overflow: 'scroll',
                      padding: 2,
                      border: '1px solid black',
                    }}
                  >
                    {showArchiveInitiators &&
                      filterConfigs &&
                      filterConfigs
                        .find(
                          (filterConfig) =>
                            filterConfig.fieldName === 'archiveInitiator'
                        )
                        ?.allValues?.map((value) => (
                          <div key={value}>
                            <Button
                              sx={{ textAlign: 'left', lineHeight: 'normal' }}
                              onClick={() => {
                                addArchiveInitiator(value)
                              }}
                            >
                              {value}
                            </Button>
                          </div>
                        ))}
                  </Box>
                )}
              </div>
            </Grid>
            <Grid item md={7} xs={12}>
              <TextField
                id="series"
                label="Serier"
                variant="outlined"
                multiline
                rows={4}
                value={editUser.series ?? undefined}
                onChange={(event) => {
                  const updatedUser = {
                    ...editUser,
                  }
                  updatedUser.series = event.target.value.replaceAll('\n', '')
                  setEditUser(updatedUser)
                }}
                fullWidth
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <p>
                Ange de serier användaren ska kunna se i läsesalen. Allt
                material för en arkivbildare som anges här kommer vara åtkomligt
                för användaren. Ange flera volymer med semikolon mellan.
                Exempelvis:
                <br />
                <i>
                  Deponent1&gt;Arkivbildare1&gt;SerieA;
                  <br />
                  Deponent2&gt;Arkivbildare1&gt;SerieM;
                </i>
              </p>
            </Grid>
            <Grid item md={7} xs={12}>
              <TextField
                id="volumes"
                label="Volymer"
                variant="outlined"
                multiline
                rows={4}
                value={editUser.volumes ?? undefined}
                onChange={(event) => {
                  const updatedUser = {
                    ...editUser,
                  }
                  updatedUser.volumes = event.target.value.replaceAll('\n', '')
                  setEditUser(updatedUser)
                }}
                fullWidth
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <p>
                Ange de volymer användaren ska kunna se i läsesalen. Allt
                material för en volym som anges här kommer vara åtkomligt för
                användaren. Ange flera volymer med semikolon mellan. Exempelvis:
                <br />
                <i>
                  Deponent1&gt;Arkivbildare1&gt;SerieA&gt;Volym1;
                  <br />
                  Deponent2&gt;Arkivbildare1&gt;SerieM&gt;Volym5;
                </i>
              </p>
            </Grid>
            <Grid item md={7} xs={12}>
              <TextField
                id="fileNames"
                label="Dokument"
                variant="outlined"
                multiline
                rows={4}
                value={editUser.fileNames ?? undefined}
                onChange={(event) => {
                  const updatedUser = {
                    ...editUser,
                  }
                  updatedUser.fileNames = event.target.value
                  setEditUser(updatedUser)
                }}
                fullWidth
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <p>
                Ange filnamn för de dokument användaren ska kunna se i
                läsesalen. Ange flera filnamn med semikolon mellan. Exempelvis:
                <br />
                <i>
                  Filnamn1.jpg;
                  <br />
                  Filnamn2.pdf;
                  <br />
                  Filnamn10.pdf;
                </i>
              </p>
            </Grid>
            <Grid item md={7} xs={12}>
              <FormControlLabel
                control={<Checkbox id="locked" />}
                label="Låst"
                checked={editUser.locked}
                onChange={(event, checked: boolean) => {
                  const updatedUser = {
                    ...editUser,
                  }
                  updatedUser.locked = checked
                  setEditUser(updatedUser)
                }}
              />
            </Grid>
            <Grid item md={5} xs={12}>
              Efter tre misslyckade inloggningsförsök markeras konto automatiskt
              som låst, och kan då inte användas för inloggning.
            </Grid>
            <Grid item md={7} xs={12}>
              <FormControlLabel
                control={<Checkbox id="disabled" />}
                label="Avstängt"
                checked={editUser.disabled}
                onChange={(event, checked: boolean) => {
                  const updatedUser = {
                    ...editUser,
                  }
                  updatedUser.disabled = checked
                  setEditUser(updatedUser)
                }}
              />
            </Grid>
            <Grid item md={5} xs={12}>
              Om ett konto är låst så har det låsts manuellt av en
              administratör.
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
