import { useFieldValues } from './useFilters'

export const useFieldOptions = (fieldName: string, filter?: string) => {
  const { data } = useFieldValues({ filter })

  const options =
    data?.find((filterConfig) => filterConfig.fieldName === fieldName)
      ?.allValues || []

  return options
}
