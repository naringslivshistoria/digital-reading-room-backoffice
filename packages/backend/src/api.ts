import KoaRouter from '@koa/router'
import { routes as userRoutes } from './services/userService'

const router = new KoaRouter()

userRoutes(router)

router.get('(.*)/auth/is-logged-in', async (ctx) => {
  if (ctx.state?.user) {
    ctx.body = {
      username: ctx.state?.user?.username,
      depositors: ctx.state?.user?.depositors,
      archiveInitiators: ctx.state?.user?.archiveInitiators,
    }
  } else {
    ctx.status = 401
  }
})

export default router
