
import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthenticationService } from '@/main/factories/services'

export const makeFacebookLoginController = (): FacebookLoginController => {
  const facebookAuthService = makeFacebookAuthenticationService()
  return new FacebookLoginController(facebookAuthService)
}
