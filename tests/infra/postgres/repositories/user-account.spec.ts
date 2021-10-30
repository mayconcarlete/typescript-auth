import { getRepository, Repository, getConnection } from 'typeorm'
import { IBackup } from 'pg-mem'

import { PgUser } from '@/infra/postgres/entities'
import { PostgresUserAccountRepository } from '@/infra/postgres/repositories'
import { makeFakeDb } from '../mocks'

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
