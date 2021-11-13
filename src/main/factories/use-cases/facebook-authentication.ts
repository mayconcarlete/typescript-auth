import { FacebookAuthenticationUseCase } from '@/domain/use-cases'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePostgresAccountRepository } from '@/main/factories/repositories'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'

export const makeFacebookAuthentication = (): FacebookAuthenticationUseCase => {
  const tokenGenerator = makeJwtTokenGenerator()
  const pgUserAccountRepo = makePostgresAccountRepository()
  const facebookApi = makeFacebookApi()
  return new FacebookAuthenticationUseCase(facebookApi, pgUserAccountRepo, tokenGenerator)
}
