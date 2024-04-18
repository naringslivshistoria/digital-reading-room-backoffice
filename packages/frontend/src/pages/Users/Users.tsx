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
} from '@mui/material'
import { Link } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useConfirm } from 'material-ui-confirm'

import { useIsLoggedIn } from '../../common/hooks/useIsLoggedIn'
import { useUsers } from './hooks/useUsers'
import { User } from '../../common/types'
import { useDeleteUser } from './hooks/useUser'

const Users = () => {
  useIsLoggedIn()

  const { data: data, isLoading: isLoading } = useUsers()
  const confirm = useConfirm()
  const deleteUserMutation = useDeleteUser()

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
          <Typography variant="h2">Administrera användare</Typography>
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            {data == null && isLoading
              ? 'Användarna hämtas...'
              : data == null && !isLoading
              ? 'Inga användare hittades'
              : ''}
          </Typography>
          <Link
            to="user"
            state={{
              user: {
                username: '',
                role: 'User',
                depositors:
                  'Centrum för Näringslivshistoria;Föreningen Stockholms Företagsminnen',
              },
            }}
          >
            <Button variant="contained">Skapa användare</Button>
          </Link>

          {data != null && data?.users != null && (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      Användarnamn (epost)
                    </TableCell>
                    <TableCell align="left">Deponenter</TableCell>
                    <TableCell align="left">Arkiv</TableCell>
                    <TableCell align="left">Roll</TableCell>
                    <TableCell align="left">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.users.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { backgroundColor: 'lightgray' },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Link to={`user?id=${user.id}`} state={{ user }}>
                          <EditIcon /> {user.username}
                        </Link>
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
                            overflow: 'hidden',
                            maxWidth: '150px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {user.archiveInitiators}
                        </Box>
                      </TableCell>
                      <TableCell align="left">{user.role}</TableCell>
                      <TableCell align="left">
                        {getUserStatus(user)}{' '}
                        <Button
                          onClick={() => {
                            deleteUser(user)
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </Grid>
    </>
  )
}

export default Users
