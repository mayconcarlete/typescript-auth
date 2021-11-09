import './config/module-alias'
import 'reflect-metadata'

import env from './config/env'
import { app } from './config/app'

app.listen(env.appPort, () => {
  console.log(`Server is running at http://localhost:${env.appPort}`)
})
