import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'ts-jest/utils'

import { AuthenticationError } from '@/domain/errors'
import { FacebookAccount } from '@/domain/models'
import { FacebookAuthenticationService } from '@/data/services'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repository'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>

  const facebookData = {
    name: 'any_facebook_name',
    email: 'any_facebook_mail@mail.com',
    facebookId: 'facebook_id'
  }

  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue(facebookData)

    userAccountRepository = mock()
    userAccountRepository.load.mockResolvedValue(undefined)

    sut = new FacebookAuthenticationService(facebookApi, userAccountRepository)
  })

  it('should call facebook.loadUser with correct params', async () => {
    await sut.perform({ token: 'any_token' })
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when facebookApi.loadUser return undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token: 'invalid_token' })
    expect(authResult).toEqual({ result: new AuthenticationError() })
  })

  it('should call userAccountRepository.load when facebookApi.loadUser returns data', async () => {
    await sut.perform({ token: 'valid_token' })

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_facebook_mail@mail.com' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call SaveFacebookAccountRepository with facebookAccount', async () => {
    const facebookAccountStub = jest.fn().mockImplementation(() => {
      return {
        any: 'any'
      }
    })

    mocked(FacebookAccount).mockImplementation(facebookAccountStub)
    await sut.perform({ token: 'valid_token' })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })
})
