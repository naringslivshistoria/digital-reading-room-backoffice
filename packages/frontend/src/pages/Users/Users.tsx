import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
  TextField,
} from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AppsIcon from '@mui/icons-material/Apps'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useConfirm } from 'material-ui-confirm'
import { useState } from 'react'

import { useIsLoggedIn } from '../../common/hooks/useIsLoggedIn'
import { useUsers } from './hooks/useUsers'
import { User } from '../../common/types'
import { useDeleteUser } from './hooks/useUser'
import Chip from '@mui/material/Chip'

const Users = () => {
  useIsLoggedIn()

  const { data: data, isLoading: isLoading } = useUsers()
  const confirm = useConfirm()
  const deleteUserMutation = useDeleteUser()
  const location = useLocation()
  const [showGrid, setShowGrid] = useState<boolean>(
    location.state?.showGrid ?? true
  )
  const [expandedGroup, setExpandedGroup] = useState<string | null>(
    location.state?.expandedGroup || null
  )
  const [searchQuery, setSearchQuery] = useState<string>('')

  const getUserStatus = (user: User): string => {
    if (user.locked) {
      return 'Låst'
    }

    if (user.disabled) {
      return 'Avaktiverat'
    }

    return 'Aktivt'
  }

  const deleteUser = async (user: User) => {
    try {
      await confirm({
        title: 'Radera användaren?',
        description: `Är du säker på att du vill radera användaren ${user.username}? Detta går inte att ångra i efterhand.`,
        cancellationText: 'Avbryt',
        confirmationText: 'Radera',
      })

      deleteUserMutation.mutateAsync(user.id as string)
    } catch (err) {
      /* User opted to cancel */
    }
  }

  const displayGridMode = (grid: boolean) => {
    setShowGrid(grid)
  }

  const filterUsers = (users: User[]) => {
    if (!searchQuery) return users

    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.depositors?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const groupUsersByGroup = (users: User[]) => {
    const filteredUsers = filterUsers(users)
    const groupedUsers: { [key: string]: User[] } = {
      ungrouped: [],
    }

    filteredUsers.forEach((user) => {
      if (!Array.isArray(user.groups) || user.groups.length === 0) {
        groupedUsers['ungrouped'].push(user)
      } else {
        user.groups.forEach((group) => {
          if (!groupedUsers[group]) {
            groupedUsers[group] = []
          }
          groupedUsers[group].push(user)
        })
      }
    })

    if (groupedUsers['ungrouped'].length === 0) {
      delete groupedUsers['ungrouped']
    }

    return groupedUsers
  }

  const handleGroupClick = (group: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setShowGrid(true)
    setExpandedGroup(group)
  }

  const renderUsersTable = (users: User[]) => (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            Användarnamn (epost)
          </TableCell>
          <TableCell align="left">Deponenter</TableCell>
          <TableCell align="left">Grupp</TableCell>
          <TableCell align="left">Roll</TableCell>
          <TableCell align="left">Status</TableCell>
          <TableCell align="right">Åtgärder</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.id}
            sx={{
              '&:last-child td, &:last-child th': { border: 0 },
            }}
          >
            <TableCell component="th" scope="row">
              {user.username}
            </TableCell>
            <TableCell align="left">
              <Box
                sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  maxWidth: '350px',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.depositors}
              </Box>
            </TableCell>
            <TableCell align="left" width={'25%'}>
              <Box
                sx={{
                  textOverflow: 'ellipsis',
                  maxWidth: '150px',
                  whiteSpace: 'nowrap',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {Array.isArray(user.groups) && user.groups.length > 0 ? (
                    user.groups.map((group) => (
                      <Chip
                        key={group}
                        label={group}
                        variant="outlined"
                        onClick={(e) => handleGroupClick(group, e)}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))
                  ) : (
                    <Chip
                      label="Ogrupperade"
                      variant="outlined"
                      onClick={(e) => handleGroupClick('ungrouped', e)}
                      sx={{ cursor: 'pointer' }}
                    />
                  )}
                </Box>
              </Box>
            </TableCell>
            <TableCell align="left">{user.role}</TableCell>
            <TableCell align="left">{getUserStatus(user)}</TableCell>
            <TableCell align="right">
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Link
                  to={`user?id=${user.id}`}
                  state={{ user, expandedGroup, showGrid }}
                >
                  <IconButton size="small" color="warning">
                    <EditIcon />
                  </IconButton>
                </Link>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => deleteUser(user)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <>
      <Grid item md={10} xs={10} sx={{ paddingTop: 10 }}>
        <Stack
          rowGap={4}
          spacing={4}
          justifyContent="flex-start"
          display={'block'}
          sx={{ marginBottom: '40px' }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h2">Administrera användare</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Autocomplete
                freeSolo
                options={[]}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Sök användare eller deponent..."
                  />
                )}
                inputValue={searchQuery}
                onInputChange={(_, newValue) => setSearchQuery(newValue)}
              />
              <Box>
                <IconButton
                  onClick={() => displayGridMode(true)}
                  sx={{
                    color: showGrid ? 'secondary.main' : '#adafaf',
                  }}
                >
                  <AppsIcon />
                </IconButton>
                <IconButton
                  onClick={() => displayGridMode(false)}
                  sx={{
                    color: !showGrid ? 'secondary.main' : '#adafaf',
                  }}
                >
                  <FormatListBulletedIcon />
                </IconButton>
              </Box>
              <Link
                to="user"
                state={{
                  user: {
                    username: '',
                    role: 'User',
                    depositors:
                      'Centrum för Näringslivshistoria;Föreningen Stockholms Företagsminnen',
                  },
                  showGrid,
                  expandedGroup,
                }}
              >
                <Button variant="contained">Skapa användare</Button>
              </Link>
            </Box>
          </Box>

          <Typography variant="body2">
            {data == null && isLoading
              ? 'Användarna hämtas...'
              : data == null && !isLoading
              ? 'Inga användare hittades'
              : ''}
          </Typography>

          {data != null && data?.users != null && (
            <>
              {filterUsers(data.users).length === 0 ? (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Inga användare matchade din sökning
                  </Typography>
                </Box>
              ) : showGrid ? (
                <Box sx={{ mt: 2 }}>
                  <TableContainer
                    component={Paper}
                    sx={{
                      boxShadow: 2,
                    }}
                  >
                    {Object.entries(groupUsersByGroup(data.users)).map(
                      ([group, users]) => (
                        <Accordion
                          key={group}
                          expanded={expandedGroup === group}
                          onChange={() =>
                            setExpandedGroup(
                              expandedGroup === group ? null : group
                            )
                          }
                          sx={{
                            margin: '0 !important',
                          }}
                        >
                          <AccordionSummary
                            expandIcon={
                              <ExpandMoreIcon
                                sx={{
                                  color:
                                    expandedGroup === group
                                      ? 'primary.contrastText'
                                      : 'inherit',
                                  '.MuiAccordionSummary-root:hover &': {
                                    color: 'primary.contrastText',
                                  },
                                }}
                              />
                            }
                            sx={{
                              '&:hover': {
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText',
                              },
                              '&.Mui-expanded': {
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText',
                              },
                            }}
                          >
                            <Typography variant="subtitle1">
                              {group === 'ungrouped' ? 'Ogrupperade' : group} (
                              {users.length} användare)
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ padding: 0 }}>
                            {renderUsersTable(users)}
                          </AccordionDetails>
                        </Accordion>
                      )
                    )}
                  </TableContainer>
                </Box>
              ) : (
                <TableContainer
                  component={Paper}
                  sx={{
                    boxShadow: 2,
                    mt: 2,
                  }}
                >
                  {renderUsersTable(filterUsers(data.users))}
                </TableContainer>
              )}
            </>
          )}
        </Stack>
      </Grid>
    </>
  )
}

export default Users
