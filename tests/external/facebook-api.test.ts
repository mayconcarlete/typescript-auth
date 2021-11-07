import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('FacebookApi integration test', () => {
  it('should return a Facebook User if token is valid', async () => {
    const httpClient = new AxiosHttpClient()
    const sut = new FacebookApi(
      env.facebookApi.clientId,
      env.facebookApi.client_secret,
      httpClient
    )
    const facebookUser = await sut.loadUser({ token: 'EAAsZAGwDAWbIBADbVKI6UvLjAXUEkZBZCR4OxST6ZC4C6AtgNGTu8R4J6R1DrYLpcJJJc6zHh0tvM4cIJNiy6QZCmhkXMll5RbBLhdabVZBhpjwWavZA9qkGyZAZB2PmNtaoUTtCLwShaCn42yEpLsNCZAatxUO1K2VxskvS0OvN4CSWQIIKE3IoLlTELo646D7vYl3zECazD0gNkiwWu0w4pA' })
    expect(facebookUser).toEqual({
      name: 'Maycon Test',
      email: 'maycon_bkvvjhu_test@tfbnw.net',
      facebookId: '100135802492519'
    })
  })
})
