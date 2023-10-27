import KoaRouter from '@koa/router'
import { getUsers } from './adapters/user-adapter'

export const routes = (router: KoaRouter) => {
  router.get('(.*)/user/users', async (ctx) => {
    const { query } = ctx

    const users = await getUsers()

    ctx.body = {
      users: users,
    }
  })
}
