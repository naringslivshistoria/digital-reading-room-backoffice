import { useFieldOptions } from './useFieldOptions'
import { FilteredOptionsProps } from '../../../common/types'

export const useFilteredOptions = ({
  fieldName,
  fieldNames,
  filterFieldName,
  filterValue,
  selectedItems,
}: FilteredOptionsProps) => {
  const levelIndex = fieldNames.indexOf(fieldName)

  const options = useFieldOptions(
    fieldName,
    filterValue ? `${filterFieldName}::${filterValue}` : undefined
  )

  const parentLevelItems = selectedItems.filter(
    (item) => item.split('>')[levelIndex - 1] === filterValue
  )

  const filteredItems = parentLevelItems.map(
    (item) => item.split('>')[levelIndex]
  )

  const filteredOptions = options.filter(
    (option) => !filteredItems.includes(option)
  )

  return filteredOptions
}
