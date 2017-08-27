const { promisify } = require('util')

const Redis = require('ioredis')
const Koa = require('koa')
const Router = require('koa-router')
const { promisifyAll } = require('bluebird')
const jwt = require('jsonwebtoken')

const random = require('./random')

const client = new Redis(process.env.REDIS_URI)
const app = new Koa()
app.use(require('koa-body')())
app.use(require('koa-logger')())

const router = Router()
router.post('/auth',   auth)
router.get('/verify', verify)
router.post('/check', check)
app.use(router.routes())

console.log(`Starting on port ${process.env.PORT}`);
app.listen(process.env.PORT)

function auth (ctx) {
    const { email } = ctx.request.body
    const [ clientOTP, emailOTP ] = [ random(1024), random(1024) ]

    client.hmset(
        email,
        { clientOTP, emailOTP }
    )
    client.expire(email, process.env.EXPIRE)

    ctx.body = { clientOTP }
}

async function verify (ctx) {
    const { email, otp } = ctx.request.query

    const { emailOTP } = await client.hgetall(email)
    if (decodeURIComponent(otp) !== emailOTP) {
        ctx.status = 401
        return
    }

    const token = jwt.sign({ email }, process.env.SECRET)
    client.hset(email, 'token', token)

    ctx.status = 200
}

async function check (ctx) {
    const { email, otp } = ctx.body

    const { token } = await client.hgetall(email)

    if (!token) {
        ctx.status = 401
        return
    }

    ctx.body = { token }
}
