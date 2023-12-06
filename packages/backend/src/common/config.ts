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
  readingRoom: {
    url: string
  }
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
    readingRoom: {
      url: 'http://localhost:4002',
    },
    auth: {
      secret:
        'Kungen, Drottningen, Kronprinsessan och Prins Daniel höll i dag ett videomöte med Kungl. Vetenskapsakademien.',
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
  readingRoom: config.get('readingRoom'),
  auth: config.get('auth'),
  postgres: config.get('postgres'),
} as Config
