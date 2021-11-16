import { makeFacebookApi } from '@/main/factories/apis'
import { makePostgresAccountRepository } from '@/main/factories/repositories'
import { makeJwtTokenHandler } from '@/main/factories/crypto'
import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  const tokenGenerator = makeJwtTokenHandler()
  const pgUserAccountRepo = makePostgresAccountRepository()
  const facebookApi = makeFacebookApi()
  return setupFacebookAuthentication(facebookApi, pgUserAccountRepo, tokenGenerator)
}
