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
    if (ctx.state.user.role !== 'Admin') {
      console.error('User role is wrong', ctx.state.user)
      return (ctx.status = 403)
    }

    const user = await getUser(ctx.params.id)

    ctx.body = {
      user: user,
    }
  })

  router.post('(.*)/users/:id', async (ctx) => {
    if (ctx.state.user.role !== 'Admin') {
      console.error('User role is wrong', ctx.state.user)
      return (ctx.status = 403)
    }

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
    if (ctx.state.user.role !== 'Admin') {
      console.error('User role is wrong', ctx.state.user)
      return (ctx.status = 403)
    }

    await deleteUser(ctx.params.id)

    ctx.status = 200
  })

  router.get('(.*)/users', async (ctx) => {
    if (ctx.state.user.role !== 'Admin') {
      console.error('User role is wrong', ctx.state.user)
      return (ctx.status = 403)
    }

    const users = await getUsers()

    ctx.body = {
      users: users,
    }
  })
}
