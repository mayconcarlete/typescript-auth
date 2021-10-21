import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repository'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookData = await this.facebookApi.loadUser(params)
    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.email })
      await this.userAccountRepository.saveWithFacebook({
        id: accountData?.id,
        name: accountData?.name ?? facebookData.name,
        email: facebookData.email,
        facebookId: facebookData.facebookId
      })
      return { result: { accessToken: facebookData.facebookId } }
    }
    return { result: new AuthenticationError() }
  }
}
