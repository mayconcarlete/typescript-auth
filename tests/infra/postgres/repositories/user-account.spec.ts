import { Entity, PrimaryGeneratedColumn, Column, getRepository } from 'typeorm'
import { newDb } from 'pg-mem'

import { LoadUserAccountRepository } from '@/data/contracts/repository'

class PostgresUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepository = getRepository(PgUser)
    const pgUser = await pgUserRepository.findOne({ email: params.email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }
}

@Entity()
class PgUser {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true })
  name?: string

  @Column()
  email!: string

  @Column({ nullable: true })
  facebook_id?: string
}

describe('PostgresUserAccountRepository', () => {
  describe('LoadUserAccountRepository', () => {
    it('should return an account if email exists', async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })
      await connection.synchronize()

      const pgUserRepository = getRepository(PgUser)
      await pgUserRepository.save({ email: 'existing@mail.com' })
      const sut = new PostgresUserAccountRepository()

      const account = await sut.load({ email: 'existing@mail.com' })

      expect(account).toEqual({ id: '1' })
      await connection.close()
    })

    it('should return undefined if email doenst exist', async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })
      await connection.synchronize()

      const sut = new PostgresUserAccountRepository()

      const account = await sut.load({ email: 'new_email@mail.com' })

      expect(account).toBeUndefined()
      connection.close()
    })
  })
})
