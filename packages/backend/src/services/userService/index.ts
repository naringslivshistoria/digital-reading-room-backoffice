import KoaRouter from '@koa/router'
import { getUsers, getUser, updateUser } from './adapters/user-adapter'
import { User } from '../../common/types'

export const routes = (router: KoaRouter) => {
  router.get('(.*)/users/:id', async (ctx) => {
    const user = await getUser(ctx.params.id)

    ctx.body = {
      user: user,
    }
  })

  router.post('(.*)/users/:id', async (ctx) => {
    const user = await updateUser(ctx.request.body as User)

    ctx.body = {
      user: user,
    }
  })

  router.get('(.*)/users', async (ctx) => {
    const { query } = ctx

    const users = await getUsers()

    ctx.body = {
      users: users,
    }
  })
}
