import { PostgresUserAccountRepository } from '@/infra/postgres/repositories'

export const makePostgresAccountRepository = (): PostgresUserAccountRepository => {
  return new PostgresUserAccountRepository()
}
