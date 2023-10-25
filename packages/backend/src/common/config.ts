import configPackage from '@iteam/config'
import dotenv from 'dotenv'
dotenv.config()

interface Postgres {
  host: string
  user: string
  password: string
  database: string
  port: number
}

interface Account {
  id: string
  userName: string
  salt: string
  hash: string
}

export interface Config {
  port: number
  postgres: Postgres
  // core: {
  //   url: string
  //   username: string
  //   password: string
  // }
  auth: {
    secret: string
    expiresIn: string
    maxFailedLoginAttempts: number
    cookieDomain: string
    testAccount: Account
  }
}

const config = configPackage({
  file: `${__dirname}/../../config.json`,
  defaults: {
    port: 7001,
    core: {
      url: 'http://localhost:5010',
    },
    auth: {
      secret: 'very secret. replace this with something smart',
      expiresIn: '3h', // format allowed by https://github.com/zeit/ms
      maxFailedLoginAttempts: 3,
      cookieDomain: 'localhost',
    },
    postgres: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'postgrespassword',
      database: 'readingroom',
      port: 5433,
    },
  },
})

export default {
  port: config.get('port'),
  core: config.get('core'),
  auth: config.get('auth'),
  postgres: config.get('postgres'),
} as Config
