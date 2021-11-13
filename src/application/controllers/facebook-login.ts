import { FacebookAuthentication } from '@/domain/features'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { AccessToken } from '@/domain/models'
import { ValidationBuilder, Validator } from '@/application/validation'
import { Controller } from '@/application/controllers'

type HttpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController extends Controller {
  constructor (
    private readonly facebookAuthentication: FacebookAuthentication
  ) {
    super()
  }

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const { result } = await this.facebookAuthentication.perform({ token })
    console.log('Entrei aqui')
    return result instanceof AccessToken
      ? ok({ accessToken: result.value })
      : unauthorized()
  }

  override buildValidators ({ token }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: token, fieldName: 'token' }).required().build()
    ]
  }
}
