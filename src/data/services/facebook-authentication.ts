import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repository'
import { TokenGenerator } from '@/data/contracts/crypto'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AccessToken, FacebookAccount } from '@/domain/models'

type Params = FacebookAuthentication.Params
type Result = FacebookAuthentication.Result

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async perform ({ token }: Params): Promise<Result> {
    const facebookData = await this.facebookApi.loadUser({ token })
    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.email })
      const facebookAccount = new FacebookAccount(facebookData, accountData)
      const { id } = await this.userAccountRepository.saveWithFacebook(facebookAccount)
      const token = await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
      return { result: new AccessToken(token) }
    }
    return { result: new AuthenticationError() }
  }
}
