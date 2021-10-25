import { mock, MockProxy } from 'jest-mock-extended'

import { FacebookApi } from '@/infra/apis'
import { HttpGetClient } from '@/infra/http'
import { LoadFacebookUserApi } from '@/data/contracts/apis'

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
    httpClient.get
      .mockResolvedValueOnce({ access_token: 'any_app_token' })
      .mockResolvedValueOnce({ data: { user_id: 'any_user_id' } })
    sut = new FacebookApi(clientId, clientSecret, httpClient)
  })

  it('should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token/',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grand_type: clientCredentials
      }
    })
  })

  it('should get debug token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token/',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  })

  it('should get user info', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any_user_id/',
      params: {
        fields: 'id,name,email',
        access_token: 'any_app_token'
      }
    })
  })
})
