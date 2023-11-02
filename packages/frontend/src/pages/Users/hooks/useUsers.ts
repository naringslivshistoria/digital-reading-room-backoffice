import axios, { AxiosError } from 'axios'
import { useQuery } from 'react-query'

import { User } from '../../../common/types'

const backendUrl = import.meta.env.VITE_BACKEND_URL || '/api'

export interface Account {
  name: string
  username: string
}

export interface UserResponse {
  users: Array<User> | undefined
}

export const useUsers = () => {
  return useQuery<UserResponse, AxiosError>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get<UserResponse>(`${backendUrl}/users`, {
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
        withCredentials: true,
      })

      return data
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
}
