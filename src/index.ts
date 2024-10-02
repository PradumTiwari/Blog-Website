import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello CloudFlare workers!')
})

export default app
