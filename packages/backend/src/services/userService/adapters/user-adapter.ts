import knex from 'knex'
import config from '../../../common/config'
import { User } from '../../../common/types'

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
      'role'
    )
    .from<User>('users')

  console.log('rows', rows)
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
      'role'
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
    id = await db('users').insert(user).returning('id')
  }

  return id
}

export { getUsers, getUser, updateUser }
