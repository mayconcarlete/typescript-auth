import { Router } from 'express'

export default (router: Router): void => {
  router.post('/v1/api/login/facebook', (req, res) => {
    res.json({ data: 'any_data' })
  })
}
