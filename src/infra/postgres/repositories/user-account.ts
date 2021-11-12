import { getRepository } from 'typeorm'

import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repository'
import { PgUser } from '@/infra/postgres/entities'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result
type SaveParams = SaveFacebookAccountRepository.Params
type SaveResult = SaveFacebookAccountRepository.Result

export class PostgresUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly pgUserRepository = getRepository(PgUser)
  async load ({ email }: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepository.findOne({ email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ email, facebookId, name, id }: SaveParams): Promise<SaveResult> {
    let resultId: string
    if (id === undefined) {
      const account = await this.pgUserRepository.save({ email, facebookId, name })
      resultId = account.id.toString()
      return { id: resultId }
    } else {
      resultId = id
      await this.pgUserRepository.update({ id: parseInt(id) }, { name, facebook_id: facebookId })
      return { id: resultId }
    }
  }
}
