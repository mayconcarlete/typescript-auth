import { mock, MockProxy } from 'jest-mock-extended'
import { FacebookAuthentication } from '@/domain/features/'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'
import { FacebookLoginController } from '@/application/controllers'
import { ServerError, UnauthorizedError } from '@/application/errors'
import { RequiredStringValidator } from '@/application/validation'

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuth: MockProxy<FacebookAuthentication>
  let token: string

  beforeAll(() => {
    token = 'any_token'
    facebookAuth = mock()
    facebookAuth.perform.mockResolvedValue({ result: new AccessToken('any_value') })
  })
  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })
  it('should build validators correctly', async () => {
    const validators = await sut.buildValidators({ token })

    expect(validators).toEqual([
      new RequiredStringValidator('any_token', 'token')
    ])
  })
  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token })
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })
  it('should return 401 when authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce({ result: new AuthenticationError() })

    const response = await sut.handle({ token: 'any_token' })

    expect(response).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })
  it('should return 200 when authentication succeeds', async () => {
    const response = await sut.handle({ token })

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

    const response = await sut.handle({ token })

    expect(response).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
