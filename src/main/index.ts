import './config/module-alias'
import 'reflect-metadata'

import env from './config/env'
import { app } from './config/app'
import { createConnection } from 'typeorm'
import { config } from '../infra/postgres/helpers/config'

createConnection(config)
  .then(() => {
    app.listen(env.appPort, () => {
      console.log(`Server is running at http://localhost:${env.appPort}`)
    })
  }).catch(console.error)
