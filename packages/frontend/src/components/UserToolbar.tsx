import {
  Box,
  Button,
  IconButton,
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  selectedUsers,
  onBatchAction,
}: UserToolbarProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <FormControl
        sx={{ minWidth: 200 }}
        size="small"
        disabled={selectedUsers.size === 0}
      >
        <InputLabel>Batch-åtgärd</InputLabel>
        <Select
          onChange={(event) => onBatchAction(event.target.value)}
          label="Batch-åtgärd"
          value=""
        >
          <MenuItem value="depositors">Ändra deponenter</MenuItem>
          <MenuItem value="archiveInitiators">Ändra arkivbildare</MenuItem>
          <MenuItem value="series">Ändra serier</MenuItem>
          <MenuItem value="volumes">Ändra volymer</MenuItem>
          <MenuItem value="fileNames">Ändra filnamn</MenuItem>
          <MenuItem value="groups">Ändra grupp</MenuItem>
          <MenuItem value="status">Ändra status</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 200 }} size="small">
        <Autocomplete
          freeSolo
          options={[]}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Sök användare eller deponent..."
            />
          )}
          inputValue={searchQuery}
          onInputChange={(_, newValue) => onSearchChange(newValue)}
          size="small"
        />
      </FormControl>
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
  )
}

export default UserToolbar
