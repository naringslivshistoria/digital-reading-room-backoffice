import KoaRouter from '@koa/router'
import { getUsers } from './adapters/user-adapter'

export const routes = (router: KoaRouter) => {
  router.get('(.*)/user/users', async (ctx) => {
    const { query } = ctx

    const users = getUsers()

    ctx.body = {
      users: users,
    }

    // if (!query.password) {
    //   ctx.status = 400
    //   ctx.body = { errorMessage: 'Missing parameter: password' }
    //   return
    // }
    // const saltAndHash = await hash.createSaltAndHash(query.password as string)
    // ctx.body = saltAndHash
  })
}
