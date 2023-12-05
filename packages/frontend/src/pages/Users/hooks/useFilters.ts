import axios, { AxiosError } from 'axios'
import { useQuery } from 'react-query'

const readingRoomUrl = import.meta.env.VITE_READING_ROOM_URL || '/api'

export enum FilterType {
  freeText = 0,
  values = 1,
}

export interface FieldFilterConfig {
  fieldName: string
  parentField?: string
  displayName: string
  filterType: FilterType
  values?: string[]
  allValues?: string[]
  visualSize: number
}

export interface FieldFilter {
  fieldName: string
  values: string[]
}

export const useFieldValues = ({
  filter,
}: {
  filter: string | undefined | null
}) =>
  useQuery<FieldFilterConfig[], AxiosError>({
    queryFn: async () => {
      const filterparam = filter ? '?filter=' + encodeURIComponent(filter) : ''
      const { data } = await axios.get(
        `${readingRoomUrl}/search/get-field-filters${filterparam}`,
        {
          headers: {
            Accept: 'application/json',
          },
          withCredentials: true,
        }
      )

      return data
    },
    staleTime: Infinity,
  })
