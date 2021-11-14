import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/domain/contracts/repository'
import { TokenGenerator } from '@/domain/contracts/crypto'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'

type Setup = (facebookApi: LoadFacebookUserApi, userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository, crypto: TokenGenerator) => FacebookAuthentication
type Params = {token: string}
type Result = {result: AccessToken | AuthenticationError}
export type FacebookAuthentication = (params: Params) => Promise<Result>

export const setupFacebookAuthentication: Setup = (facebookApi, userAccountRepository, crypto) => async ({ token }): Promise<Result> => {
  const facebookData = await facebookApi.loadUser({ token })
  if (facebookData !== undefined) {
    const accountData = await userAccountRepository.load({ email: facebookData.email })
    const facebookAccount = new FacebookAccount(facebookData, accountData)
    const { id } = await userAccountRepository.saveWithFacebook(facebookAccount)
    const token = await crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
    return { result: new AccessToken(token) }
  }
  return { result: new AuthenticationError() }
}
