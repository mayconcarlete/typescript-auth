
import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthentication } from '@/main/factories/use-cases'

export const makeFacebookLoginController = (): FacebookLoginController => {
  const facebookAuthService = makeFacebookAuthentication()
  return new FacebookLoginController(facebookAuthService)
}
