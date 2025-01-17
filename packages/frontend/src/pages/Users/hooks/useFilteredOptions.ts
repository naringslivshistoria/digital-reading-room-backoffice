import { useFieldOptions } from './useFieldOptions'
import { FilteredOptionsProps } from '../../../common/types'

export const useFilteredOptions = ({
  fieldName,
  fieldNames,
  filterFieldName,
  filterValue,
  selectedItems,
  currentValue,
}: FilteredOptionsProps) => {
  const options = useFieldOptions(
    fieldName,
    filterValue ? `${filterFieldName}::${filterValue}` : undefined
  )

  const levelIndex = fieldNames.indexOf(fieldName)
  let filteredOptions = [...options]

  const isLastField = levelIndex === fieldNames.length - 1

  if (isLastField) {
    const filteredItems = selectedItems
      .map((item) => item.split('>')[levelIndex])
      .filter((item) => item && item !== currentValue)

    filteredOptions = filteredOptions.filter(
      (option) => !filteredItems.includes(option)
    )
  }

  if (currentValue && !filteredOptions.includes(currentValue)) {
    filteredOptions.push(currentValue)
  }

  return filteredOptions
}
