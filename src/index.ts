import './main/config/module-alias'
import express, { Request, Response } from 'express'

const app = express()

app.use(express.json())

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/', async (req: Request, res: Response) => { return res.json({ hello: 'world' }) })

app.listen(3000, () => {
  console.log('we are on fire on port 3000, just to test')
})
