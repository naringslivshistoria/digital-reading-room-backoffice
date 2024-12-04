import { useMemo } from 'react'

import { useFieldOptions } from './useFieldOptions'
import { FilteredOptionsProps } from '../../../common/types'

export const useFilteredOptions = ({
  fieldName,
  filterFieldName,
  filterValue,
  selectedItems,
  levelIndex,
  currentValue,
}: FilteredOptionsProps): string[] => {
  const options = useFieldOptions(
    fieldName,
    filterValue ? `${filterFieldName}::${filterValue}` : undefined
  )

  return useMemo(() => {
    const filteredItems = selectedItems
      .map((item) => item.split('>')[levelIndex])
      .filter((item) => item && item !== currentValue)

    const filteredOptions = options.filter(
      (option) => !filteredItems.includes(option)
    )

    if (currentValue && !filteredOptions.includes(currentValue)) {
      filteredOptions.push(currentValue)
    }

    return filteredOptions
  }, [options, selectedItems, levelIndex, currentValue])
}
