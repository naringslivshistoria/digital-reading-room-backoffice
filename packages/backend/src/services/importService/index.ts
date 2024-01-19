import KoaRouter from '@koa/router'
import { getImports, createImport } from './adapters/import-adapter'

export const routes = (router: KoaRouter) => {
  router.get('(.*)/import', async (ctx) => {
    const imports = await getImports()

    ctx.body = imports
  })

  router.post('(.*)/import', async (ctx) => {
    const name = ctx.request.body.name
    const levelIdsString = ctx.request.body.levelIds
    const imports = await createImport(name, levelIdsString.split(','))

    ctx.body = imports
  })
}
