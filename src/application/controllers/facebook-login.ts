import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { AccessToken } from '@/domain/entities'
import { ValidationBuilder, Validator } from '@/application/validation'
import { Controller } from '@/application/controllers'
import { FacebookAuthentication } from '@/domain/use-cases'

type HttpRequest = {token: string}

type Model = Error | {accessToken: string}

export class FacebookLoginController extends Controller {
  constructor (
    private readonly facebookAuthentication: FacebookAuthentication
  ) {
    super()
  }

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const { result } = await this.facebookAuthentication({ token })
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
