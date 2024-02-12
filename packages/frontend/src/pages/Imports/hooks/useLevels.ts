import axios from 'axios'
import { useMutation, useQueryClient } from 'react-query'

const backendUrl = import.meta.env.VITE_BACKEND_URL || '/api'

export const useDeleteLevels = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['levels'],
    mutationFn: async ({ levelIds }: { levelIds: string }) => {
      const result = await axios(`${backendUrl}/document/deletelevels`, {
        method: 'POST',
        data: {
          levelIds,
        },
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
        withCredentials: true,
      })

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries('levels')
    },
  })
}
