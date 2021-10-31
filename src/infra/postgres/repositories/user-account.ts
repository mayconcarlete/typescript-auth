import { getRepository } from 'typeorm'

import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repository'
import { PgUser } from '@/infra/postgres/entities'

export class PostgresUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
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

  async saveWithFacebook (params: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    const pgUserRepository = getRepository(PgUser)
    const account = await pgUserRepository.save({
      email: params.email,
      facebook_id: params.facebookId,
      name: params.name
    })
    return {
      id: account.id.toString()
    }
  }
}
