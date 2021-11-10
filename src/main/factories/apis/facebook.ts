import env from '@/main/config/env'
import { FacebookApi } from '@/infra/apis'
import { makeAxiosHttpClient } from '@/main/factories/http'

export const makeFacebookApi = (): FacebookApi => {
  const httpClient = makeAxiosHttpClient()
  return new FacebookApi(
    env.facebookApi.clientId,
    env.facebookApi.client_secret,
    httpClient
  )
}
