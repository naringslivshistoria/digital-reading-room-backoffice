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

  const archiveInitiatorOptions = useFilteredOptions({
    fieldName: 'archiveInitiator',
    fieldNames: section.fieldNames,
    filterFieldName: 'depositor',
    filterValue: sectionFormState.depositor,
    selectedItems,
    currentItems: sectionFormState,
  })

  const rawSeriesOptions = useFilteredOptions({
    fieldName: 'seriesName',
    fieldNames: section.fieldNames,
    filterFieldName: 'archiveInitiator',
    filterValue: sectionFormState.archiveInitiator,
    selectedItems,
    currentItems: sectionFormState,
  })

  const rawVolumeOptions = useFilteredOptions({
    fieldName: 'volume',
    fieldNames: section.fieldNames,
    filterFieldName: 'seriesName',
    filterValue: sectionFormState.seriesName,
    selectedItems,
    currentItems: sectionFormState,
  })

  const seriesOptions = section.fieldNames.includes('seriesName')
    ? rawSeriesOptions
    : undefined

  const volumeOptions = section.fieldNames.includes('volume')
    ? rawVolumeOptions
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
          archiveInitiatorValue={sectionFormState.archiveInitiator}
          onArchiveInitiatorChange={(value) =>
            handleFormChange(formStateSection, 'archiveInitiator', value)
          }
          seriesValue={sectionFormState.seriesName}
          onSeriesChange={(value) =>
            handleFormChange(formStateSection, 'seriesName', value)
          }
          volumeValue={sectionFormState.volume}
          onVolumeChange={(value) =>
            handleFormChange(formStateSection, 'volume', value)
          }
          depositorOptions={depositorOptions}
          archiveOptions={archiveInitiatorOptions}
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
