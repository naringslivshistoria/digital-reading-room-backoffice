import axios from 'axios'
import { useMutation } from 'react-query'

import { User } from '../../../common/types'

const backendUrl = import.meta.env.VITE_BACKEND_URL || '/api'

export const useUpdateUser = () => {
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
  })
}
