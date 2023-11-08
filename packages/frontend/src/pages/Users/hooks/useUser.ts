import axios from 'axios'
import { useMutation, useQueryClient } from 'react-query'

import { User } from '../../../common/types'

const backendUrl = import.meta.env.VITE_BACKEND_URL || '/api'

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['users'],
    mutationFn: async (user: User) => {
      await axios(`${backendUrl}/users/${user.id}`, {
        method: 'POST',
        data: user,
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
        withCredentials: true,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries('users')
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['users'],
    mutationFn: async (id: string) => {
      await axios(`${backendUrl}/users/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
        withCredentials: true,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries('users')
    },
  })
}
