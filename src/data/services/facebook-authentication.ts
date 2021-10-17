import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repository'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly createFacebookAccountRepository: CreateFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookData = await this.loadFacebookUserApi.loadUser(params)
    if (facebookData !== undefined) {
      const repositoryData = await this.loadUserAccountRepository.load({ email: facebookData.email })
      if (repositoryData === undefined) {
        await this.createFacebookAccountRepository.createFromFacebook(facebookData)
      }
      return { result: { accessToken: facebookData.facebookId } }
    }
    return { result: new AuthenticationError() }
  }
}
