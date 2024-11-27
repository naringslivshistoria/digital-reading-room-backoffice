import { Grid, Typography, Tooltip } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'

import { ItemSelector } from './ItemSelector'
import { ItemList } from './ItemList'
import { UserFormState, ItemSectionProps } from '../../../common/types'

export const ItemSection = ({
  title,
  tooltip,
  formStateSection,
  formState,
  handleFormChange,
  handleAddItem,
  handleRemoveItem,
  depositorOptions,
  archiveOptions,
  seriesOptions,
  volumeOptions,
  disabled,
}: ItemSectionProps) => {
  const sectionFormState = formState[formStateSection] as Record<string, string>
  const selectedItems =
    formState.selectedItems[
      formStateSection as keyof UserFormState['selectedItems']
    ]

  return (
    <>
      <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h3">{title}</Typography>
        <Tooltip title={tooltip} placement="right">
          <InfoIcon color="action" />
        </Tooltip>
      </Grid>
      <Grid item xs={12}>
        <ItemSelector
          depositorValue={sectionFormState.depositor}
          onDepositorChange={(value) =>
            handleFormChange(formStateSection, 'depositor', value)
          }
          archiveValue={sectionFormState.archive}
          onArchiveChange={(value) =>
            handleFormChange(formStateSection, 'archive', value)
          }
          seriesValue={sectionFormState.series}
          onSeriesChange={(value) =>
            handleFormChange(formStateSection, 'series', value)
          }
          volumeValue={sectionFormState.volume}
          onVolumeChange={(value) =>
            handleFormChange(formStateSection, 'volume', value)
          }
          depositorOptions={depositorOptions}
          archiveOptions={archiveOptions}
          seriesOptions={seriesOptions}
          volumeOptions={volumeOptions}
          onAdd={() => handleAddItem(formStateSection)}
          disabled={disabled}
        />
        <ItemList
          items={selectedItems}
          onDelete={(item) => handleRemoveItem(formStateSection, item)}
        />
      </Grid>
    </>
  )
}
