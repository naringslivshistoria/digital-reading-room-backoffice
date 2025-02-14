import { useFieldOptions } from './useFieldOptions'
import { FilteredOptionsProps } from '../../../common/types'

export const useFilteredOptions = ({
  fieldName,
  fieldNames,
  selectedItems,
  currentItems,
}: FilteredOptionsProps) => {
  const levelIndex = fieldNames.indexOf(fieldName)
  const previousFields = fieldNames.slice(0, levelIndex)

  const filterString = previousFields
    .map((key) => (currentItems[key] ? `${key}::${currentItems[key]}` : null))
    .filter(Boolean)
    .join('||')

  const options = useFieldOptions(fieldName, filterString || undefined)

  const prefixChain = previousFields
    .map((key) => currentItems[key])
    .filter(Boolean)
    .join('>')

  const selectedValuesForThisLevel = selectedItems
    .map((sel) => sel.split('>'))
    .filter(
      (parts) =>
        parts.length === levelIndex + 1 &&
        parts.slice(0, levelIndex).join('>') === prefixChain
    )
    .map((parts) => parts[levelIndex])

  return options.filter(
    (option) => !selectedValuesForThisLevel.includes(option)
  )
}
