import { getRepository, Repository, getConnection } from 'typeorm'
import { IBackup } from 'pg-mem'

import { PgUser } from '@/infra/postgres/entities'
import { PostgresUserAccountRepository } from '@/infra/postgres/repositories'
import { makeFakeDb } from '../mocks'

describe('PostgresUserAccountRepository', () => {
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
  describe('LoadUserAccountRepository', () => {
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
  describe('SaveFacebookAccountRepository', () => {
    it('should create an account if id is not provided', async () => {
      const newAccount = {
        email: 'valid_mail@mail.com',
        name: 'valid_name',
        facebookId: 'valid_facebook_id'
      }

      const { id } = await sut.saveWithFacebook(newAccount)
      const account = await pgUserRepository.findOne({ email: newAccount.email })

      expect(account?.id).toBe(1)
      expect(id).toBe('1')
    })

    it('should update an account if id already exists', async () => {
      await pgUserRepository.save({
        email: 'valid_mail@mail.com',
        name: 'valid_name',
        facebookId: 'valid_facebook_id'
      })

      const newAccount = {
        id: '1',
        email: 'new_mail@mail.com',
        name: 'new_name',
        facebookId: 'new_valid_facebook_id'
      }
      await sut.saveWithFacebook(newAccount)
      const account = await pgUserRepository.findOne({ id: 1 })

      expect(account).toEqual({
        id: 1,
        name: 'new_name',
        facebook_id: 'new_valid_facebook_id',
        email: 'valid_mail@mail.com'
      })
    })
  })
})
