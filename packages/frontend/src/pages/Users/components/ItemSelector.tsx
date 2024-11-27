import { Grid, IconButton, Autocomplete, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import { ItemSelectorProps } from '../../../common/types'

export const ItemSelector = ({
  depositorValue,
  onDepositorChange,
  archiveValue,
  onArchiveChange,
  seriesValue,
  onSeriesChange,
  volumeValue,
  onVolumeChange,
  depositorOptions,
  archiveOptions,
  seriesOptions,
  volumeOptions,
  onAdd,
  disabled = false,
}: ItemSelectorProps) => {
  const fields = [
    {
      label: 'Välj deponent',
      placeholder: 'Sök deponent...',
      value: depositorValue,
      onChange: onDepositorChange,
      options: depositorOptions,
      disabled: false,
    },
    {
      label: 'Välj arkivbildare',
      placeholder: 'Sök arkivbildare...',
      value: archiveValue,
      onChange: onArchiveChange,
      options: archiveOptions,
      disabled: !depositorValue || archiveOptions.length === 0,
    },
  ]

  if (seriesOptions && onSeriesChange) {
    fields.push({
      label: 'Välj serie',
      placeholder: 'Sök serie...',
      value: seriesValue || '',
      onChange: onSeriesChange,
      options: seriesOptions,
      disabled: !archiveValue || seriesOptions.length === 0,
    })
  }

  if (volumeOptions && onVolumeChange) {
    fields.push({
      label: 'Välj volym',
      placeholder: 'Sök volym...',
      value: volumeValue || '',
      onChange: onVolumeChange,
      options: volumeOptions,
      disabled: !seriesValue || volumeOptions.length === 0,
    })
  }

  return (
    <Grid container>
      <Grid sx={{ display: 'flex', gap: 2, flex: 1 }}>
        {fields.map((field, index) => (
          <Autocomplete
            key={index}
            options={field.options}
            value={field.value || null}
            onChange={(_, newValue) => field.onChange(newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label={field.label}
                placeholder={field.placeholder}
              />
            )}
            fullWidth
            disabled={field.disabled}
          />
        ))}

        <IconButton onClick={onAdd} disabled={disabled}>
          <AddIcon />
        </IconButton>
      </Grid>
    </Grid>
  )
}
