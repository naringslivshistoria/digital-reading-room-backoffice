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
import {
  User,
  UserFormState,
  FormSection,
  FormSectionKey,
} from '../../common/types'
import { useFieldOptions } from './hooks/useFieldOptions'
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
    archiveInitiators: { depositor: '', archiveInitiator: '' },
    series: { depositor: '', archiveInitiator: '', seriesName: '' },
    volumes: {
      depositor: '',
      archiveInitiator: '',
      seriesName: '',
      volume: '',
    },
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
    const sectionDef = Object.values(sections).find(
      (s) => s.formStateSection === section
    )

    if (sectionDef && typeof formState[section] === 'object') {
      const fieldIndex = sectionDef.fieldNames.indexOf(field)
      setFormState((prev) => {
        const newSectionState = { ...(prev[section] as Record<string, string>) }
        newSectionState[field] = value
        for (let i = fieldIndex + 1; i < sectionDef.fieldNames.length; i++) {
          const f = sectionDef.fieldNames[i]
          newSectionState[f] = ''
        }
        return { ...prev, [section]: newSectionState }
      })
    } else {
      setFormState((prev) => ({ ...prev, [section]: value }))
    }
  }

  const handleAddItem = (type: string) => {
    let fields: string[] = []
    if (type === 'depositors') {
      if (!formState.depositors) return
      fields = [formState.depositors]
      if (formState.selectedItems.depositors.includes(fields[0])) return
    } else {
      const values = Object.values(formState[type as keyof UserFormState])
      if (values.some((value) => !value)) return
      fields = values as string[]
      const newItem = fields.join('>')
      if (
        formState.selectedItems[
          type as keyof UserFormState['selectedItems']
        ].includes(newItem)
      )
        return
    }

    const newItem = fields.join('>')
    const updatedItems = [
      ...formState.selectedItems[type as keyof UserFormState['selectedItems']],
      newItem,
    ]

    setFormState((prev) => {
      let newSectionState: (typeof prev)[keyof UserFormState] =
        prev[type as keyof UserFormState]
      if (type !== 'depositors') {
        const section = sections[type as keyof typeof sections]
        if (section) {
          const lastField = section.fieldNames[section.fieldNames.length - 1]
          newSectionState = {
            ...(prev[type as keyof UserFormState] as FormSection),
            [lastField]: '',
          } as (typeof prev)[keyof UserFormState]
        }
      } else {
        newSectionState = ''
      }

      return {
        ...prev,
        selectedItems: {
          ...prev.selectedItems,
          [type]: updatedItems,
        },
        [type]: newSectionState,
      }
    })
    setSelectedValues((prev) => [...prev, newItem])
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

  const renderEditField = () => {
    const sec = sections[editType as keyof typeof sections]

    switch (editType) {
      case 'archiveInitiators':
      case 'series':
      case 'volumes':
        return (
          <Grid sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <ItemSection
              key={sec.title}
              title={sec.title}
              tooltip={sec.tooltip}
              formStateSection={sec.formStateSection}
              formState={formState}
              handleFormChange={handleFormChange}
              handleAddItem={handleAddItem}
              handleRemoveItem={handleRemoveItem}
              depositorOptions={depositorOptions}
              section={sec}
            />
          </Grid>
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
              clearOnBlur
              selectOnFocus
              options={allGroups || []}
              value={selectedValues}
              onChange={(_, newValue) => {
                if (newValue.length < selectedValues.length) {
                  setSelectedValues(newValue)
                  return
                }

                const lastValue = newValue[newValue.length - 1]
                if (lastValue?.trim().length > 1) {
                  setSelectedValues(newValue)
                }
              }}
              onBlur={(event) => {
                const inputValue = (event.target as HTMLInputElement).value
                if (inputValue?.trim().length > 1) {
                  setSelectedValues([...selectedValues, inputValue.trim()])
                }
              }}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option}
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
              clearOnBlur
              selectOnFocus
              value={selectedValues}
              onChange={(_, newValue) => {
                if (newValue.length < selectedValues.length) {
                  setSelectedValues(newValue)
                  return
                }

                const lastValue = newValue[newValue.length - 1]
                if (lastValue?.trim().length > 1) {
                  setSelectedValues(newValue)
                }
              }}
              onBlur={(event) => {
                const inputValue = (event.target as HTMLInputElement).value
                if (inputValue?.trim().length > 1) {
                  setSelectedValues([...selectedValues, inputValue.trim()])
                }
              }}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option}
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    editType === 'fileNames' ? 'Lägg till filer' : 'Välj värden'
                  }
                  placeholder={
                    editType === 'fileNames' ? 'Skriv filnamn...' : 'Sök...'
                  }
                />
              )}
              fullWidth
            />
          </Grid>
        )
    }
  }

  const sections = {
    archiveInitiators: {
      title: 'Arkivbildare',
      tooltip: 'Välj arkivbildare som ska tilldelas alla markerade användare',
      formStateSection: 'archiveInitiators' as FormSectionKey,
      fieldNames: ['depositor', 'archiveInitiator'],
    },
    series: {
      title: 'Serier',
      tooltip: 'Välj serier som ska tilldelas alla markerade användare',
      formStateSection: 'series' as FormSectionKey,
      fieldNames: ['depositor', 'archiveInitiator', 'seriesName'],
    },
    volumes: {
      title: 'Volymer',
      tooltip: 'Välj volymer som ska tilldelas alla markerade användare',
      formStateSection: 'volumes' as FormSectionKey,
      fieldNames: ['depositor', 'archiveInitiator', 'seriesName', 'volume'],
    },
  }

  return (
    <Grid item md={10} xs={10}>
      <Box sx={{ marginTop: 3, marginBottom: 2 }}>
        <Link to="/users">
          <ChevronLeftIcon sx={{ marginTop: '-2px' }} /> Användare
        </Link>
      </Box>
      <Typography variant="h2">Ändrar {getTitle().toLowerCase()}</Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Redigerar <strong>{users.length}</strong> användare
      </Typography>
      <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
        Ändringar kommer att skriva över alla markerade användares värden för
        den valda batch-redigeringen.
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
