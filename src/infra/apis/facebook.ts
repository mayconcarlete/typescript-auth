import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { HttpGetClient } from '@/infra/http/client'

export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl: string = 'https://graph.facebook.com'
  constructor (
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly httpClient: HttpGetClient
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    const appToken = await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token/`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grand_type: 'client_credentials'
      }
    })
    const debugToken = await this.httpClient.get({
      url: `${this.baseUrl}/debug_token/`,
      params: {
        access_token: appToken.access_token,
        input_token: params.token
      }
    })
    const facebookUserInfo = await this.httpClient.get({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      url: `${this.baseUrl}/${debugToken.data.user_id}/`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: appToken.access_token
      }
    })
    return {
      name: facebookUserInfo.name,
      email: facebookUserInfo.email,
      facebookId: facebookUserInfo.id
    }
  }
}
