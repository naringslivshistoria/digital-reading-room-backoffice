import KoaRouter from '@koa/router'
import config from '../../common/config'
import { Client, estypes } from '@elastic/elasticsearch'

const client = new Client({
  node: config.elasticSearch.url,
})

export const routes = (router: KoaRouter) => {
  router.post('(.*)/document/deletelevels', async (ctx) => {
    if (ctx.state.user.role !== 'Admin') {
      console.error('User role is wrong', ctx.state.user)
      return (ctx.status = 403)
    }

    const levelIdsString = ctx.request.body.levelIds as string
    const should: estypes.QueryDslQueryContainer[] = []

    levelIdsString.split(',').forEach((levelId) => {
      should.push({
        match: {
          level: levelId,
        },
      })
    })

    const result = await client.deleteByQuery({
      index: config.elasticSearch.indexName,
      query: {
        bool: {
          should,
        },
      },
    })

    ctx.body = { deleted: result.deleted }
  })
}
