import { Autocomplete, Grid, IconButton, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { ItemSelectorProps } from '../../../common/types'

export const ItemSelector = ({
  depositorValue,
  onDepositorChange,
  archiveValue,
  onArchiveChange,
  depositorOptions,
  archiveOptions,
  seriesOptions,
  seriesValue,
  onSeriesChange,
  volumeOptions,
  volumeValue,
  onVolumeChange,
  onAdd,
  disabled = false,
}: ItemSelectorProps) => {
  return (
    <Grid sx={{ display: 'flex', gap: 2 }}>
      <Autocomplete
        options={depositorOptions}
        value={depositorValue}
        onChange={(_, newValue) => onDepositorChange(newValue || '')}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Välj deponent"
            placeholder="Sök deponent..."
          />
        )}
        fullWidth
      />
      <Autocomplete
        options={archiveOptions}
        value={archiveValue}
        onChange={(_, newValue) => onArchiveChange(newValue || '')}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Välj arkivbildare"
            placeholder="Sök arkivbildare..."
          />
        )}
        fullWidth
        disabled={!depositorValue}
      />
      {seriesOptions && (
        <Autocomplete
          options={seriesOptions}
          value={seriesValue}
          onChange={(_, newValue) => onSeriesChange(newValue || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Välj serie"
              placeholder="Sök serie..."
            />
          )}
          fullWidth
          disabled={!archiveValue}
        />
      )}

      {volumeOptions && (
        <Autocomplete
          options={volumeOptions}
          value={volumeValue}
          onChange={(_, newValue) => onVolumeChange(newValue || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Välj volym"
              placeholder="Sök volym..."
            />
          )}
          fullWidth
          disabled={!archiveValue || !seriesValue}
        />
      )}

      <IconButton onClick={onAdd} disabled={disabled}>
        <AddIcon />
      </IconButton>
    </Grid>
  )
}
