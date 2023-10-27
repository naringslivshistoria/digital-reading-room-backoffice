import {
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
import { useEffect } from 'react'
import { useIsLoggedIn } from '../../common/hooks/useIsLoggedIn'
import { useUsers } from './hooks/useUsers'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const Users = () => {
  useIsLoggedIn()

  const { data: data, isLoading: isLoading } = useUsers()

  useEffect(() => {
    console.log('data', data)
  }, [data])

  return (
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
                <TableCell>Användarnamn</TableCell>
                <TableCell align="right">Arkiv</TableCell>
                <TableCell align="right">Deponent</TableCell>
                <TableCell align="right">Låst</TableCell>
                <TableCell align="right">Inaktiverat</TableCell>
                <TableCell align="right">Roll</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.username}
                  </TableCell>
                  <TableCell align="right">{user.archiveInitiators}</TableCell>
                  <TableCell align="right">{user.depositors}</TableCell>
                  <TableCell align="right">{user.locked}</TableCell>
                  <TableCell align="right">{user.disabled}</TableCell>
                  <TableCell align="right">{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  )
}

export default Users
