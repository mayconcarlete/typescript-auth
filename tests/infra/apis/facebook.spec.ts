import { mock, MockProxy } from 'jest-mock-extended'
import { LoadFacebookUserApi } from '@/data/contracts/apis'

class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl: string = 'https://graph.facebook.com'
  constructor (
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly httpClient: HttpGetClient
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grand_type: 'client_credentials'
      }
    })
    return new Promise((resolve, reject) => {
      resolve({
        email: 'valid_facebook_mail@mail.com',
        facebookId: 'valid_facebook_id',
        name: 'valid_facebook_name'
      })
    })
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}
namespace HttpGetClient {
  export type Params = {
    url: string
    params: object
  }
}

describe('FacebookApi', () => {
  let clientId: string
  let clientSecret: string
  let clientCredentials: string
  let httpClient: MockProxy<HttpGetClient>
  let sut: LoadFacebookUserApi

  beforeAll(() => {
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'
    clientCredentials = 'client_credentials'

    httpClient = mock()
  })

  beforeEach(() => {
    sut = new FacebookApi(clientId, clientSecret, httpClient)
  })

  it('should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grand_type: clientCredentials
      }
    })
  })
})
