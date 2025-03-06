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
import Checkbox from '@mui/material/Checkbox'
import LockIcon from '@mui/icons-material/Lock'
import BlockIcon from '@mui/icons-material/Block'

import { UserTableProps } from '../common/types'
import DepositorChip from './DepositorChip'
import DepositorTooltip from './DepositorTooltip'

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
  selectedUsers,
  onUserSelect,
}: UserTableProps) => {
  const currentPage = group ? pageByGroup?.[group] || 0 : page
  const startIndex = currentPage * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const displayedUsers = users.slice(startIndex, endIndex)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const visibleColumns = availableColumns.filter(
    (column) =>
      (!isMobile || !column.hideOnMobile) &&
      column.id !== 'locked' &&
      column.id !== 'disabled'
  )

  const MAX_DEPOSITORS = 11

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked

    users.forEach((user) => {
      if (user.id) {
        // Only call onUserSelect if we need to change the selection state
        const isCurrentlySelected = selectedUsers.has(user.id)
        if (checked !== isCurrentlySelected) {
          onUserSelect(user.id)
        }
      }
    })
  }

  return (
    <>
      <Table
        sx={{ minWidth: 650, tableLayout: 'fixed' }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" sx={{ width: '48px' }}>
              <Checkbox
                onChange={handleSelectAll}
                checked={users.every(
                  (user) => user.id && selectedUsers.has(user.id)
                )}
                indeterminate={
                  users.some((user) => user.id && selectedUsers.has(user.id)) &&
                  !users.every((user) => user.id && selectedUsers.has(user.id))
                }
              />
            </TableCell>
            {visibleColumns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                sx={{
                  whiteSpace: 'nowrap',
                  minWidth: column.minWidth,
                  width:
                    column.id === 'depositors'
                      ? '55%'
                      : column.id === 'username'
                      ? '15%'
                      : 'auto',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  '&:hover': {
                    overflow: 'visible',
                    backgroundColor: theme.palette.background.paper,
                    zIndex: 1,
                  },
                }}
              >
                {column.label}
              </TableCell>
            ))}
            <TableCell align="right" sx={{ width: '120px' }}>
              Åtgärder
            </TableCell>
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
              <TableCell padding="checkbox" sx={{ width: '48px' }}>
                <Checkbox
                  checked={user.id ? selectedUsers.has(user.id) : false}
                  onChange={() => user.id && onUserSelect(user.id)}
                />
              </TableCell>
              {visibleColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{
                    whiteSpace: 'nowrap',
                    minWidth: column.minWidth,
                    width:
                      column.id === 'depositors'
                        ? '55%'
                        : column.id === 'username'
                        ? '15%'
                        : 'auto',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {column.id === 'groups' ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {Array.isArray(user.groups) && user.groups.length > 0 ? (
                        user.groups.map((group) => (
                          <Chip
                            key={group}
                            label={group}
                            variant="outlined"
                            onClick={(e) => handleGroupClick(group, e)}
                            sx={{ cursor: 'pointer', margin: '2px 0' }}
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
                  ) : column.id === 'depositors' ? (
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                        flexWrap: 'wrap',
                        maxHeight: '72px',
                        overflow: 'hidden',
                        position: 'relative',
                        width: '100%',
                      }}
                    >
                      {user.depositors
                        ?.split(';')
                        .slice(0, MAX_DEPOSITORS)
                        .map((depositor: string) => (
                          <DepositorChip
                            key={depositor}
                            depositor={depositor}
                            truncate={true}
                          />
                        ))}
                      {user.depositors &&
                        user.depositors.split(';').length > MAX_DEPOSITORS && (
                          <Tooltip
                            title={
                              <DepositorTooltip
                                depositors={user.depositors.split(';')}
                              />
                            }
                            arrow
                            placement="top"
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: 'background.paper',
                                  '& .MuiTooltip-arrow': {
                                    color: 'background.paper',
                                  },
                                  boxShadow: theme.shadows[2],
                                  p: 0,
                                  maxWidth: 'none',
                                },
                              },
                            }}
                          >
                            <Chip
                              label={`+${
                                user.depositors.split(';').length -
                                MAX_DEPOSITORS
                              }`}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ cursor: 'pointer' }}
                            />
                          </Tooltip>
                        )}
                    </Box>
                  ) : column.id === 'username' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {user[column.id]}
                      {user.locked && (
                        <Tooltip title="Låst konto" arrow>
                          <LockIcon color="error" fontSize="small" />
                        </Tooltip>
                      )}
                      {user.disabled && (
                        <Tooltip title="Avaktiverat konto" arrow>
                          <BlockIcon color="error" fontSize="small" />
                        </Tooltip>
                      )}
                    </Box>
                  ) : (
                    user[column.id]
                  )}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ width: '120px' }}>
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
