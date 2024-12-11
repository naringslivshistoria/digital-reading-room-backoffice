import {
  Alert,
  Box,
  Button,
  Grid,
  Typography,
  Autocomplete,
  Chip,
  TextField,
  Tooltip,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import InfoIcon from '@mui/icons-material/Info'

import { useUpdateUser } from './hooks/useUser'
import { User, UserFormState } from '../../common/types'
import { useFieldOptions } from './hooks/useFieldOptions'
import { ItemList } from './components/ItemList'
import { ItemSection } from './components/ItemSection'

export const BatchEdit = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const updateUser = useUpdateUser()
  const [error, setError] = useState<string | null>(null)
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [statusValues, setStatusValues] = useState({
    locked: false,
    disabled: false,
  })
  const { users, editType, allGroups } = location.state
  const [formState, setFormState] = useState<UserFormState>({
    depositors: '',
    archiveInitiators: { depositor: '', archive: '' },
    series: { depositor: '', archive: '', series: '' },
    volumes: { depositor: '', archive: '', series: '', volume: '' },
    selectedItems: {
      depositors: [],
      archiveInitiators: [],
      series: [],
      volumes: [],
      fileNames: [],
    },
  })

  const depositorOptions = useFieldOptions('depositor')

  const handleFormChange = (
    section: keyof UserFormState,
    field: string,
    value: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      [section]:
        typeof prev[section] === 'object'
          ? {
              ...Object.fromEntries(
                Object.entries(prev[section] as Record<string, string>).map(
                  ([key, currentValue], index, array) => {
                    const fieldIndex = array.findIndex(([k]) => k === field)
                    return [key, index <= fieldIndex ? currentValue : '']
                  }
                )
              ),
              [field]: value,
            }
          : value,
    }))
  }

  const handleAddItem = (type: string) => {
    let fields: string[] = []

    if (type === 'depositors') {
      if (!formState.depositors) return
      fields = [formState.depositors]
      if (selectedValues.includes(fields[0])) return
    } else {
      const values = Object.values(formState[type as keyof UserFormState])
      if (values.some((value) => !value)) return
      fields = values as string[]
      const newItem = fields.join('>')
      if (selectedValues.includes(newItem)) return
    }

    const newItem = fields.join('>')
    setSelectedValues((prev) => [...prev, newItem])
    setFormState((prev) => ({
      ...prev,
      [type]:
        type === 'depositors'
          ? ''
          : {
              ...(prev[type as keyof UserFormState] as Record<string, string>),
              [Object.keys(prev[type as keyof UserFormState]).pop() || '']: '',
            },
    }))
  }

  const handleSave = async () => {
    setError(null)
    try {
      await Promise.all(
        users.map((user: User) => {
          const updatedUser = {
            ...user,
            groups: Array.isArray(user.groups)
              ? JSON.stringify(user.groups)
              : user.groups,
            ...(editType === 'status' && statusValues),
            ...(editType === 'groups' && {
              groups: JSON.stringify(selectedValues),
            }),
            ...(editType !== 'status' &&
              editType !== 'groups' && {
                [editType]: selectedValues.join(';'),
              }),
          }

          console.log('Updating user:', updatedUser)
          return updateUser.mutateAsync(updatedUser)
        })
      )
      navigate('/users')
    } catch (error: any) {
      console.error('Error updating users:', error)
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error)
      } else {
        setError('Ett fel uppstod vid uppdatering av användare')
      }
    }
  }

  const sections: Record<
    string,
    {
      title: string
      tooltip: string
      formStateSection: keyof UserFormState
      fieldNames: string[]
    }
  > = {
    archiveInitiators: {
      title: 'Arkivbildare',
      tooltip: 'Välj arkivbildare som ska tilldelas alla markerade användare',
      formStateSection: 'archiveInitiators',
      fieldNames: ['depositor', 'archiveInitiator'],
    },
    series: {
      title: 'Serier',
      tooltip: 'Välj serier som ska tilldelas alla markerade användare',
      formStateSection: 'series',
      fieldNames: ['depositor', 'archiveInitiator', 'seriesName'],
    },
    volumes: {
      title: 'Volymer',
      tooltip: 'Välj volymer som ska tilldelas alla markerade användare',
      formStateSection: 'volumes',
      fieldNames: ['depositor', 'archiveInitiator', 'seriesName', 'volumeName'],
    },
  }

  const handleRemoveItem = (
    type: keyof UserFormState['selectedItems'],
    itemToRemove: string
  ) => {
    const updatedItems = formState.selectedItems[type].filter(
      (item) => item !== itemToRemove
    )
    setFormState((prev) => ({
      ...prev,
      selectedItems: {
        ...prev.selectedItems,
        [type]: updatedItems,
      },
    }))
  }

  const renderEditField = () => {
    switch (editType) {
      case 'archiveInitiators':
      case 'series':
      case 'volumes':
        return (
          <>
            <ItemSection
              key={sections[editType as keyof typeof sections].title}
              title={sections[editType as keyof typeof sections].title}
              tooltip={sections[editType as keyof typeof sections].tooltip}
              formStateSection={
                sections[editType as keyof typeof sections].formStateSection
              }
              formState={formState}
              handleFormChange={handleFormChange}
              handleAddItem={handleAddItem}
              handleRemoveItem={handleRemoveItem}
              depositorOptions={depositorOptions}
              section={sections[editType as keyof typeof sections]}
            />
            <Grid item xs={12}>
              <ItemList
                items={selectedValues}
                onDelete={(item) => {
                  setSelectedValues((prev) => prev.filter((v) => v !== item))
                }}
              />
            </Grid>
          </>
        )

      case 'groups':
        return (
          <Grid sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h3">{getTitle()}</Typography>
                <Tooltip
                  title="Välj värden som ska tilldelas alla markerade användare"
                  placement="right"
                >
                  <InfoIcon color="action" />
                </Tooltip>
              </Box>
            </Grid>
            <Autocomplete
              multiple
              freeSolo
              options={allGroups || []}
              value={selectedValues}
              onChange={(_, newValue) => setSelectedValues(newValue)}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option, index) => (
                  // eslint-disable-next-line react/jsx-key
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Välj grupper"
                  placeholder="Skriv eller välj grupp..."
                />
              )}
              fullWidth
            />
          </Grid>
        )

      case 'status':
        return (
          <Grid sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h3">{getTitle()}</Typography>
                <Tooltip
                  title="Välj värden som ska tilldelas alla markerade användare"
                  placement="right"
                >
                  <InfoIcon color="action" />
                </Tooltip>
              </Box>
            </Grid>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={statusValues.locked}
                    onChange={(e) =>
                      setStatusValues((prev) => ({
                        ...prev,
                        locked: e.target.checked,
                      }))
                    }
                  />
                }
                label="Låst"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={statusValues.disabled}
                    onChange={(e) =>
                      setStatusValues((prev) => ({
                        ...prev,
                        disabled: e.target.checked,
                      }))
                    }
                  />
                }
                label="Avstängt"
              />
            </Box>
          </Grid>
        )

      default:
        return (
          <Grid sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h3">{getTitle()}</Typography>
                <Tooltip
                  title="Välj värden som ska tilldelas alla markerade användare"
                  placement="right"
                >
                  <InfoIcon color="action" />
                </Tooltip>
              </Box>
            </Grid>
            <Autocomplete
              multiple
              options={editType === 'fileNames' ? [] : depositorOptions}
              freeSolo={editType === 'fileNames'}
              value={selectedValues}
              onChange={(_, newValue) => setSelectedValues(newValue)}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option, index) => (
                  // eslint-disable-next-line react/jsx-key
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Välj värden"
                  placeholder="Sök..."
                />
              )}
              fullWidth
            />
          </Grid>
        )
    }
  }

  const getTitle = () => {
    switch (editType) {
      case 'depositors':
        return 'Deponenter'
      case 'archiveInitiators':
        return 'Arkivbildare'
      case 'series':
        return 'Serier'
      case 'volumes':
        return 'Volymer'
      case 'fileNames':
        return 'Filnamn'
      case 'groups':
        return 'Grupp'
      case 'status':
        return 'Status'
      default:
        return 'Batch-redigering'
    }
  }

  return (
    <Grid item md={10} xs={10}>
      <Box sx={{ marginTop: 3, marginBottom: 2 }}>
        <Link to="/users">
          <ChevronLeftIcon sx={{ marginTop: '-2px' }} /> Användare
        </Link>
      </Box>
      <Typography variant="h2">Ändrar {getTitle().toLowerCase()}</Typography>
      <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
        Redigerar {users.length} användare
      </Typography>

      <Grid container spacing={4} columnSpacing={4} rowSpacing={4}>
        <Grid item xs={12}>
          {renderEditField()}
        </Grid>
        <Grid item xs={12}>
          {error && <Alert severity="error">{error}</Alert>}
        </Grid>
        <Grid item xs={12}>
          <Button onClick={handleSave} variant="contained">
            Spara för alla markerade användare
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
