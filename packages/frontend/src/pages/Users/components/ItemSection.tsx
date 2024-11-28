import { Grid, Typography, Tooltip } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'

import { ItemSelector } from './ItemSelector'
import { ItemList } from './ItemList'
import { UserFormState, ItemSectionProps } from '../../../common/types'
import { useFilteredOptions } from '../hooks/useFilteredOptions'

export const ItemSection = ({
  title,
  tooltip,
  formStateSection,
  formState,
  handleFormChange,
  handleAddItem,
  handleRemoveItem,
  depositorOptions,
  section,
}: ItemSectionProps) => {
  const sectionFormState = formState[formStateSection] as Record<string, string>
  const selectedItems =
    formState.selectedItems[
      formStateSection as keyof UserFormState['selectedItems']
    ]

  const archiveOptions = useFilteredOptions({
    fieldName: 'archiveInitiator',
    filterFieldName: 'depositor',
    filterValue: sectionFormState.depositor,
    selectedItems,
    levelIndex: 1,
    currentValue: sectionFormState.archive,
  })

  const seriesOptions = useFilteredOptions({
    fieldName: 'seriesName',
    filterFieldName: 'archiveInitiator',
    filterValue: sectionFormState.archive,
    selectedItems,
    levelIndex: 2,
    currentValue: sectionFormState.series,
  })

  const volumeOptions = useFilteredOptions({
    fieldName: 'volume',
    filterFieldName: 'seriesName',
    filterValue: sectionFormState.series,
    selectedItems,
    levelIndex: 3,
    currentValue: sectionFormState.volume,
  })

  const filteredSeriesOptions = section.fieldNames.includes('seriesName')
    ? seriesOptions
    : undefined

  const filteredVolumeOptions = section.fieldNames.includes('volume')
    ? volumeOptions
    : undefined

  const disabled = Object.values(sectionFormState).some((v) => !v)

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
          seriesOptions={filteredSeriesOptions}
          volumeOptions={filteredVolumeOptions}
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
