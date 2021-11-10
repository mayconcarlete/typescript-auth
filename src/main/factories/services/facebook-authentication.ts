import { FacebookAuthenticationService } from '@/data/services'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePostgresAccountRepository } from '@/main/factories/repositories'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'

export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
  const tokenGenerator = makeJwtTokenGenerator()
  const pgUserAccountRepo = makePostgresAccountRepository()
  const facebookApi = makeFacebookApi()
  return new FacebookAuthenticationService(facebookApi, pgUserAccountRepo, tokenGenerator)
}
