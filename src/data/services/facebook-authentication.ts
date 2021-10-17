import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookUserApi } from '@/data/contracts/apis'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    await this.loadFacebookUserApi.loadUser(params)
    return { result: new AuthenticationError() }
  }
}
