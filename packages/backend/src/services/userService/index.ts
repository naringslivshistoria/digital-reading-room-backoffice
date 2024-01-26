import KoaRouter from '@koa/router'
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from './adapters/user-adapter'
import { User } from '../../common/types'

export const routes = (router: KoaRouter) => {
  router.get('(.*)/users/:id', async (ctx) => {
    const user = await getUser(ctx.params.id)

    ctx.body = {
      user: user,
    }
  })

  router.post('(.*)/users/:id', async (ctx) => {
    try {
      const user = await updateUser(ctx.request.body as User)

      ctx.body = {
        user: user,
      }
    } catch (error: unknown) {
      ctx.status = 400

      if (error instanceof Error) {
        ctx.body = {
          error: error.message,
        }
      }
    }
  })

  router.delete('(.*)/users/:id', async (ctx) => {
    await deleteUser(ctx.params.id)

    ctx.status = 200
  })

  router.get('(.*)/users', async (ctx) => {
    const users = await getUsers()

    ctx.body = {
      users: users,
    }
  })
}
