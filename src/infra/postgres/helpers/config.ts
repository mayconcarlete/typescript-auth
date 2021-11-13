import { ConnectionOptions } from 'typeorm'

const entities: string[] = []

if (process.env.ENVIRONMENT === 'production') {
  entities.push('dist/src/infra/postgres/entities/index.js')
} else {
  entities.push('src/infra/postgres/entities/index.ts')
}

export const config: ConnectionOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  database: 'typescript_auth',
  username: 'postgres',
  password: 'postgres',
  entities: entities
}
