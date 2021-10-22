import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repository'
import { FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '../contracts/crypto'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookData = await this.facebookApi.loadUser(params)
    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.email })
      const facebookAccount = new FacebookAccount(facebookData, accountData)

      const { id } = await this.userAccountRepository.saveWithFacebook(facebookAccount)
      await this.crypto.generateToken({ key: id })
    }
    return { result: new AuthenticationError() }
  }
}
