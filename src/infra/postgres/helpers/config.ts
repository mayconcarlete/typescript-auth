import { ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  database: 'typescript_auth',
  username: 'postgres',
  password: 'postgres',
  entities: ['dist/src/infra/postgres/entities/index.js']
}
