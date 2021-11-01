import { mock } from 'jest-mock-extended'

import { FacebookAuthentication } from '@/domain/features/'

type HttpResponse = {
  statusCode: number
  data: any
}
class FacebookLoginController {
  constructor (
    private readonly facebookAuthentication: FacebookAuthentication
  ) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    await this.facebookAuthentication.perform({ token: httpRequest.token })
    return new Promise((resolve, reject) => {
      resolve({
        statusCode: 400,
        data: new Error('Token field is required')
      })
    })
  }
}

describe('FacebookLoginController', () => {
  it('should return 400 if token is empty', async () => {
    const facebookAuth = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuth)
    const response = await sut.handle({ token: '' })
    expect(response).toEqual({
      statusCode: 400,
      data: new Error('Token field is required')
    })
  })
  it('should return 400 if token is null', async () => {
    const facebookAuth = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuth)
    const response = await sut.handle({ token: null })
    expect(response).toEqual({
      statusCode: 400,
      data: new Error('Token field is required')
    })
  })
  it('should return 400 if token is undefined', async () => {
    const facebookAuth = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuth)
    const response = await sut.handle({ token: undefined })
    expect(response).toEqual({
      statusCode: 400,
      data: new Error('Token field is required')
    })
  })
  it('should call FacebookAuthentication with correct params', async () => {
    const facebookAuth = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuth)
    await sut.handle({ token: 'any_token' })
    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })
})
