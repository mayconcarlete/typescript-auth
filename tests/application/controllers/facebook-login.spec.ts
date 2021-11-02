import { mock, MockProxy } from 'jest-mock-extended'

import { FacebookAuthentication } from '@/domain/features/'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'

type HttpResponse = {
  statusCode: number
  data: any
}

class ServerError extends Error {
  constructor (error?: Error | any) {
    super('Server failed.Try again soon')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}
class FacebookLoginController {
  constructor (
    private readonly facebookAuthentication: FacebookAuthentication
  ) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return {
          statusCode: 400,
          data: new Error('Token field is required')
        }
      }
      const { result } = await this.facebookAuthentication.perform({ token: httpRequest.token })
      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            accessToken: result.value
          }
        }
      } else {
        return {
          statusCode: 401,
          data: new AuthenticationError()
        }
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error)
      }
    }
  }
}

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuth: MockProxy<FacebookAuthentication>

  beforeAll(() => {
    facebookAuth = mock()
    facebookAuth.perform.mockResolvedValue({ result: new AccessToken('any_value') })
  })
  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })
  it('should return 400 if token is empty', async () => {
    const response = await sut.handle({ token: '' })

    expect(response).toEqual({
      statusCode: 400,
      data: new Error('Token field is required')
    })
  })
  it('should return 400 if token is null', async () => {
    const response = await sut.handle({ token: null })

    expect(response).toEqual({
      statusCode: 400,
      data: new Error('Token field is required')
    })
  })
  it('should return 400 if token is undefined', async () => {
    const response = await sut.handle({ token: undefined })

    expect(response).toEqual({
      statusCode: 400,
      data: new Error('Token field is required')
    })
  })
  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })
  it('should return 401 when authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce({ result: new AuthenticationError() })

    const response = await sut.handle({ token: 'any_token' })

    expect(response).toEqual({
      statusCode: 401,
      data: new AuthenticationError()
    })
  })
  it('should return 200 when authentication succeeds', async () => {
    const response = await sut.handle({ token: 'any_token' })

    expect(response).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })
  it('should return 500 if authentication throws', async () => {
    const error = new Error('Server Error')
    facebookAuth.perform.mockRejectedValueOnce(new Error('Infra error'))

    const response = await sut.handle({ token: 'any_token' })

    expect(response).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
