import KoaRouter from '@koa/router'
import { routes as userRoutes } from './services/userService'
import { routes as searchRoutes } from './services/searchService'
import { routes as importRoutes } from './services/importService'
import { routes as documentRoutes } from './services/documentService'

const router = new KoaRouter()

userRoutes(router)
searchRoutes(router)
importRoutes(router)
documentRoutes(router)

router.get('(.*)/auth/is-logged-in', async (ctx) => {
  if (ctx.state?.user && ctx.state?.user?.role === 'Admin') {
    ctx.body = {
      username: ctx.state?.user?.username,
      depositors: ctx.state?.user?.depositors,
      archiveInitiators: ctx.state?.user?.archiveInitiators,
      series: ctx.state?.user?.series,
      volumes: ctx.state?.user?.volumes,
    }
  } else {
    ctx.status = 401
  }
})

export default router
