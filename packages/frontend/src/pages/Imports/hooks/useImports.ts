import axios, { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import { Import } from '../../../common/types'

const backendUrl = import.meta.env.VITE_BACKEND_URL || '/api'

export const useImports = () => {
  return useQuery<Import[], AxiosError>({
    queryKey: ['imports'],
    queryFn: async () => {
      const { data } = await axios.get<Import[]>(`${backendUrl}/import`, {
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
        withCredentials: true,
      })

      return data
    },
    refetchOnWindowFocus: false,
  })
}

export const useCreateImport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['imports'],
    mutationFn: async ({
      name,
      levelIds,
    }: {
      name: string
      levelIds: string
    }) => {
      await axios(`${backendUrl}/import`, {
        method: 'POST',
        data: {
          name,
          levelIds,
        },
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
        withCredentials: true,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries('imports')
    },
  })
}
