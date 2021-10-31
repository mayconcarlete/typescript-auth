import { getRepository } from 'typeorm'

import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repository'
import { PgUser } from '@/infra/postgres/entities'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result

type SaveParams = SaveFacebookAccountRepository.Params
type SaveResult = SaveFacebookAccountRepository.Result
export class PostgresUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly pgUserRepository = getRepository(PgUser)
  async load (params: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepository.findOne({ email: params.email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook (params: SaveParams): Promise<SaveResult> {
    if (params.id === undefined) {
      const account = await this.pgUserRepository.save({
        email: params.email,
        facebook_id: params.facebookId,
        name: params.name
      })
      return {
        id: account.id.toString()
      }
    } else {
      await this.pgUserRepository.update({ id: parseInt(params.id) }, {
        name: params.name,
        facebook_id: params.facebookId
      })
      return {
        id: params.id
      }
    }
  }
}
