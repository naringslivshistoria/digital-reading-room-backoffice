import { useFieldOptions } from './useFieldOptions'
import { FilteredOptionsProps } from '../../../common/types'

export const useFilteredOptions = ({
  fieldName,
  fieldNames,
  filterFieldName,
  filterValue,
  selectedItems,
  currentItems,
}: FilteredOptionsProps) => {
  const levelIndex = fieldNames.indexOf(fieldName)

  const prefixChainArray = fieldNames
    .slice(0, levelIndex)
    .map((pField) => currentItems[pField])
    .filter(Boolean)

  const prefixChain = prefixChainArray.join('>')

  const options = useFieldOptions(
    fieldName,
    filterValue ? `${filterFieldName}::${filterValue}` : undefined
  )

  const sameLevelSelectedItems = selectedItems.filter((sel) => {
    const parts = sel.split('>')
    if (parts.length !== levelIndex + 1) {
      return false
    }
    const itemPrefix = parts.slice(0, levelIndex).join('>')
    return itemPrefix === prefixChain
  })

  const selectedValuesForThisLevel = sameLevelSelectedItems.map((sel) => {
    const parts = sel.split('>')
    return parts[levelIndex]
  })

  const filteredOptions = options.filter(
    (option) => !selectedValuesForThisLevel.includes(option)
  )

  return filteredOptions
}
