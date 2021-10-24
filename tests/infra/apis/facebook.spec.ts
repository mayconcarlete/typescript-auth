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
