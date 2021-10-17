import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    await this.loadFacebookUserApi.loadUser(params)
    return { result: new AuthenticationError() }
  }
}

interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<LoadFacebookUserApi.Result>
}

namespace LoadFacebookUserApi{
  export type Params = {
    token: string
  }
  export type Result = undefined
}
class LoadFacebookUserSpy implements LoadFacebookUserApi {
  token?: string
  result = undefined
  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    return this.result
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApi.token).toBe('any_token')
  })

  it('should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
    const loadFacebookUserApi = new LoadFacebookUserSpy()
    loadFacebookUserApi.result = undefined
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    const authResult = await sut.perform({ token: 'invalid_token' })
    expect(authResult).toEqual({ result: new AuthenticationError() })
  })
})
