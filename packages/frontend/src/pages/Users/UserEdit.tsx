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

  return (
    editUser && (
      <>
        <Grid item md={10} xs={10}>
          <Box sx={{ marginTop: 3, marginBottom: 2 }}>
            <Link to="/users">
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
                  updatedUser.depositors = event.target.value
                  setEditUser(updatedUser)
                }}
                fullWidth
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <p>
                Ange de deponenter användaren ska kunna se i läsesalen. Allt
                material för en deponent som anges här kommer vara åtkomligt för
                användaren. Ange flera deponenter med kommatecken mellan.
              </p>
              <p>
                <button onClick={() => setShowDepositors(!showDepositors)}>
                  <b>Visa tillgängliga deponenter</b>
                </button>
                {showDepositors &&
                  filterConfigs &&
                  filterConfigs
                    .find(
                      (filterConfig) => filterConfig.fieldName === 'depositor'
                    )
                    ?.allValues?.map((value) => <li key={value}>{value}</li>)}
              </p>
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
                  updatedUser.archiveInitiators = event.target.value
                  setEditUser(updatedUser)
                }}
                fullWidth
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <p>
                Ange de arkivbildare användaren ska kunna se i läsesalen. Allt
                material för en arkivbildare som anges här kommer vara åtkomligt
                för användaren. Ange flera arkivbildare med kommatecken mellan.
              </p>
              <p>
                <button
                  onClick={() =>
                    setShowArchiveInitiators(!showArchiveInitiators)
                  }
                >
                  <b>Visa tillgängliga arkiv</b>
                </button>
                {showArchiveInitiators &&
                  filterConfigs &&
                  filterConfigs
                    .find(
                      (filterConfig) =>
                        filterConfig.fieldName === 'archiveInitiator'
                    )
                    ?.allValues?.map((value) => <li key={value}>{value}</li>)}
              </p>
            </Grid>
            <Grid item md={7} xs={12}>
              <TextField
                id="documentIds"
                label="Dokument"
                variant="outlined"
                multiline
                rows={4}
                value={editUser.documentIds ?? undefined}
                onChange={(event) => {
                  const updatedUser = {
                    ...editUser,
                  }
                  updatedUser.documentIds = event.target.value
                  setEditUser(updatedUser)
                }}
                fullWidth
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <p>
                Ange dokument-ID för de dokument användaren ska kunna se i
                läsesalen. Ange flera dokument-ID med kommatecken mellan.
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
