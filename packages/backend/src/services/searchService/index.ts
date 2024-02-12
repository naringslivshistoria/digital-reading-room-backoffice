import KoaRouter from '@koa/router'
import axios from 'axios'
import config from '../../common/config'

export const routes = (router: KoaRouter) => {
  router.get('(.*)/search/get-field-filters', async (ctx) => {
    const cookies = ctx.cookies

    console.log('cookies', cookies)

    const res = await axios(
      `${config.readingRoom.url}/api/search/get-field-filters`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'readingroom=' + cookies.get('readingroom') + ';HttpOnly',
        },
      }
    )

    ctx.body = res.data
  })
}
