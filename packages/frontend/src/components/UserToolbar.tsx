import {
  Box,
  Button,
  IconButton,
  Autocomplete,
  TextField,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import GroupsIcon from '@mui/icons-material/Groups'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'

import { UserToolbarProps } from '../common/types'

const UserToolbar = ({
  showGrid,
  searchQuery,
  onSearchChange,
  onDisplayModeChange,
  allGroups,
}: UserToolbarProps) => {
  return (
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
          onInputChange={(_, newValue) => onSearchChange(newValue)}
        />
        <Box>
          <IconButton
            onClick={() => onDisplayModeChange(true)}
            sx={{
              color: showGrid ? 'secondary.main' : '#adafaf',
            }}
          >
            <GroupsIcon />
          </IconButton>
          <IconButton
            onClick={() => onDisplayModeChange(false)}
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
              depositors: 'Föreningen Stockholms Företagsminnen',
            },
            allGroups,
          }}
        >
          <Button variant="contained">Skapa användare</Button>
        </Link>
      </Box>
    </Box>
  )
}

export default UserToolbar
