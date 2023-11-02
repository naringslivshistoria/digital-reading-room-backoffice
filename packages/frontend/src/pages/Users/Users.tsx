import {
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

import { useIsLoggedIn } from '../../common/hooks/useIsLoggedIn'
import { useUsers } from './hooks/useUsers'
import { User } from '../../common/types'

const Users = () => {
  useIsLoggedIn()

  const { data: data, isLoading: isLoading } = useUsers()

  const getUserStatus = (user: User): string => {
    if (user.locked) {
      return 'Låst'
    }

    if (user.disabled) {
      return 'Avaktiverat'
    }

    return 'Aktivt'
  }

  return (
    <>
      <Grid item md={10} xs={10} sx={{ paddingTop: 10 }}>
        <Stack rowGap={4} justifyContent="flex-start">
          <Typography variant="h2">Administrera användare</Typography>
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            {data == null && isLoading
              ? 'Användarna hämtas...'
              : data == null && !isLoading
              ? 'Inga användare hittades'
              : ''}
          </Typography>

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
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Link to={`user?id=${user.id}`} state={{ user }}>
                          {user.username}
                        </Link>
                      </TableCell>
                      <TableCell
                        align="left"
                        width={'40%'}
                        sx={{ textOverflow: 'ellipsis' }}
                      >
                        {user.depositors}
                      </TableCell>
                      <TableCell align="left" width={'25%'}>
                        {user.archiveInitiators}
                      </TableCell>
                      <TableCell align="left">{user.role}</TableCell>
                      <TableCell align="left">{getUserStatus(user)}</TableCell>
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
