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
      'failed_login_attempts as failedLoginAttempts',
      'depositors',
      'archiveInitiators',
      'role'
    )
    .from<User>('users')

  console.log('rows', rows)
  return rows
}

export { getUsers }
