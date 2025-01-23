import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material'
import { Link } from 'react-router-dom'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import { UserTableProps } from '../common/types'

const UserTable = ({
  users,
  availableColumns,
  page,
  rowsPerPage,
  group,
  pageByGroup,
  handleGroupClick,
  handleChangePage,
  handleChangeRowsPerPage,
  deleteUser,
  showGrid,
  expandedGroup,
  allGroups,
}: UserTableProps) => {
  const currentPage = group ? pageByGroup?.[group] || 0 : page
  const startIndex = currentPage * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const displayedUsers = users.slice(startIndex, endIndex)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const visibleColumns = availableColumns.filter(
    (column) => !isMobile || !column.hideOnMobile
  )

  return (
    <>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                sx={{ whiteSpace: 'nowrap', minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
            <TableCell align="right">Åtgärder</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedUsers.map((user) => (
            <TableRow
              key={user.id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
              }}
            >
              {visibleColumns.map((column) => (
                <TableCell key={column.id} align={column.align || 'left'}>
                  {column.id === 'groups' ? (
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
                  ) : column.id === 'locked' || column.id === 'disabled' ? (
                    user[column.id] ? (
                      'Ja'
                    ) : (
                      'Nej'
                    )
                  ) : (
                    user[column.id]
                  )}
                </TableCell>
              ))}
              <TableCell align="right">
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Tooltip title={user.notes || 'Inga anteckningar'} arrow>
                    <StickyNote2Icon
                      color={user.notes ? 'warning' : 'secondary'}
                    />
                  </Tooltip>
                  <Link
                    to={`user?id=${user.id}`}
                    state={{ user, showGrid, expandedGroup, allGroups }}
                  >
                    <IconButton size="small" color="secondary">
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
      <TablePagination
        component="div"
        count={users.length}
        page={group ? pageByGroup?.[group] || 0 : page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Resultat per sida:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} av ${count}`
        }
      />
    </>
  )
}

export default UserTable
