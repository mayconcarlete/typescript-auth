import { adaptExpressRoute } from '../../infra/http'
import { Router } from 'express'
import { makeFacebookLoginController } from '../factories/controllers/facebook-login'

export default (router: Router): void => {
  const controller = makeFacebookLoginController()
  const adapter = adaptExpressRoute(controller)
  router.post('/login/facebook', adapter)
}
