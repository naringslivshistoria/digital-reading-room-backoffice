import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  TableContainer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useConfirm } from 'material-ui-confirm'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useIsLoggedIn } from '../../common/hooks/useIsLoggedIn'
import { useUsers } from './hooks/useUsers'
import { User, ColumnConfig } from '../../common/types'
import { useDeleteUser } from './hooks/useUser'
import UserToolbar from '../../components/UserToolbar'
import UserTable from '../../components/UserTable'

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
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [pageByGroup, setPageByGroup] = useState<{ [key: string]: number }>({})
  const allGroups =
    data?.users?.reduce((acc: string[], user: User) => {
      if (!user.groups) {
        return acc
      }

      let groups: string[] = []
      if (typeof user.groups === 'string') {
        try {
          groups = JSON.parse(user.groups)
        } catch {
          return acc
        }
      } else if (Array.isArray(user.groups)) {
        groups = user.groups
      }

      return [...new Set([...acc, ...groups])]
    }, []) || []

  const availableColumns: ColumnConfig[] = [
    { id: 'username', label: 'Användarnamn (epost)' },
    { id: 'depositors', label: 'Deponenter' },
    { id: 'groups', label: 'Grupp' },
    { id: 'role', label: 'Roll' },
    { id: 'locked', label: 'Låst' },
    { id: 'disabled', label: 'Avaktiverad' },
  ]

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
    setPageByGroup((prev) => ({
      ...prev,
      [group]: 0,
    }))
    setPage(0)
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    if (showGrid && expandedGroup) {
      setPageByGroup((prev) => ({
        ...prev,
        [expandedGroup]: newPage,
      }))
    } else {
      setPage(newPage)
    }
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearchChange = (newValue: string) => {
    setSearchQuery(newValue)
    setPage(0)
    setPageByGroup({})
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
          <UserToolbar
            showGrid={showGrid}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onDisplayModeChange={setShowGrid}
            allGroups={allGroups}
          />

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
                            <UserTable
                              users={users}
                              availableColumns={availableColumns}
                              page={page}
                              rowsPerPage={rowsPerPage}
                              group={group}
                              pageByGroup={pageByGroup}
                              handleGroupClick={handleGroupClick}
                              handleChangePage={handleChangePage}
                              handleChangeRowsPerPage={handleChangeRowsPerPage}
                              deleteUser={deleteUser}
                              showGrid={showGrid}
                              expandedGroup={expandedGroup}
                              allGroups={allGroups}
                            />
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
                  <UserTable
                    users={filterUsers(data.users)}
                    availableColumns={availableColumns}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handleGroupClick={handleGroupClick}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    deleteUser={deleteUser}
                    showGrid={showGrid}
                    expandedGroup={expandedGroup}
                  />
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
