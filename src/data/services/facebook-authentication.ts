import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repository'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & CreateFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookData = await this.facebookApi.loadUser(params)
    if (facebookData !== undefined) {
      const repositoryData = await this.userAccountRepository.load({ email: facebookData.email })
      if (repositoryData === undefined) {
        await this.userAccountRepository.createFromFacebook(facebookData)
      }
      return { result: { accessToken: facebookData.facebookId } }
    }
    return { result: new AuthenticationError() }
  }
}
