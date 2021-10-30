import { getRepository, Repository, getConnection } from 'typeorm'
import { IBackup, IMemoryDb, newDb } from 'pg-mem'

import { PgUser } from '@/infra/postgres/entities'
import { PostgresUserAccountRepository } from '@/infra/postgres/repositories'

const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb()
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts']
  })
  await connection.synchronize()
  return db
}

describe('PostgresUserAccountRepository', () => {
  describe('LoadUserAccountRepository', () => {
    let sut: PostgresUserAccountRepository
    let pgUserRepository: Repository<PgUser>
    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDb()
      backup = db.backup()
      pgUserRepository = getRepository(PgUser)
    })

    beforeEach(() => {
      backup.restore()
      sut = new PostgresUserAccountRepository()
    })

    afterAll(async () => {
      await getConnection().close()
    })

    it('should return an account if email exists', async () => {
      await pgUserRepository.save({ email: 'existing@mail.com' })

      const account = await sut.load({ email: 'existing@mail.com' })

      expect(account).toEqual({ id: '1' })
    })

    it('should return undefined if email doenst exist', async () => {
      const account = await sut.load({ email: 'new_email@mail.com' })

      expect(account).toBeUndefined()
    })
  })
})
