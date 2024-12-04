import knex from 'knex'
import config from '../../../common/config'
import { User } from '../../../common/types'
import axios from 'axios'

const db = knex({
  client: 'pg',
  connection: {
    host: config.postgres.host,
    user: config.postgres.user,
    password: config.postgres.password,
    database: config.postgres.database,
    port: config.postgres.port,
    timezone: 'UTC',
    dateStrings: true,
  },
})

const getUsers = async () => {
  const rows = await db
    .select(
      'id',
      'username',
      'locked',
      'disabled',
      'depositors',
      'archiveInitiators',
      'documentIds',
      'fileNames',
      'series',
      'volumes',
      'role',
      'groups',
      'notes'
    )
    .from<User>('users')
    .orderBy('username')

  return rows
}

const getUser = async (id: string) => {
  const rows = await db
    .select(
      'id',
      'username',
      'locked',
      'disabled',
      'depositors',
      'archiveInitiators',
      'documentIds',
      'fileNames',
      'series',
      'volumes',
      'role',
      'groups',
      'notes'
    )
    .from<User>('users')
    .where('id', id)
  return rows.length > 0 ? rows[0] : null
}

const updateUser = async (user: User) => {
  let id: string

  if (user.id) {
    id = user.id
    await db('users').update(user).where('id', id)
  } else {
    try {
      id = await db('users')
        .insert({ ...user, salt: '', password_hash: '' })
        .returning('id')
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw error
      }
      console.error('Error creating user', error.message)
      if (
        /duplicate key value violates unique constraint/.test(error.message)
      ) {
        throw new Error(`Username ${user.username} is already in use`)
      } else {
        throw new Error('Error creating user')
      }
    }

    try {
      axios(
        `${config.readingRoom.url}/api/auth/send-reset-password-link?new=true&referer=${config.readingRoom.url}/login`,
        {
          data: {
            email: user.username,
          },
          method: 'POST',
        }
      )
    } catch (error) {
      throw new Error('Could not send invitation/password select email')
    }
  }

  return id
}

const deleteUser = async (id: string) => {
  await db('users').where({ id }).delete()
}

export { getUsers, getUser, updateUser, deleteUser }
