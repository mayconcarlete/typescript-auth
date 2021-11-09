import express, { json, Router } from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(json())

app.use((req, res, next) => {
  res.type('json')
  next()
})

const router = Router()

router.post('/v1/api/login/facebook', (req, res) => {
  res.json({ data: 'any_data' })
})

app.use(router)

export { app }
