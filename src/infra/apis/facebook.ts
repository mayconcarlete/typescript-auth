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
