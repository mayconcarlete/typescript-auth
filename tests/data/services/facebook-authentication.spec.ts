import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

class LoadFacebookUserSpy implements LoadFacebookUserApi {
  token?: string
  count=0
  result = undefined
  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    this.count++
    return this.result
  }
}

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let loadFacebookUserApi: LoadFacebookUserSpy

  beforeEach(() => {
    loadFacebookUserApi = new LoadFacebookUserSpy()
    sut = new FacebookAuthenticationService(loadFacebookUserApi)
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApi.token).toBe('any_token')
    expect(loadFacebookUserApi.count).toBe(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
    loadFacebookUserApi.result = undefined
    const authResult = await sut.perform({ token: 'invalid_token' })
    expect(authResult).toEqual({ result: new AuthenticationError() })
  })
})
