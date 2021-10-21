import { mock, MockProxy } from 'jest-mock-extended'

import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repository'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'

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

  it('should create account with facebook data', async () => {
    await sut.perform({ token: 'valid_token' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      name: 'any_facebook_name',
      email: 'any_facebook_mail@mail.com',
      facebookId: 'facebook_id'
    })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should not update account name', async () => {
    userAccountRepository.load.mockResolvedValueOnce({ id: 'valid_id', name: 'valid_name' })
    await sut.perform({ token: 'valid_token' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      id: 'valid_id',
      email: 'any_facebook_mail@mail.com',
      name: 'valid_name',
      facebookId: 'facebook_id'
    })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should update account name', async () => {
    userAccountRepository.load.mockResolvedValueOnce({ id: 'valid_id' })
    await sut.perform({ token: 'valid_token' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      id: 'valid_id',
      name: 'any_facebook_name',
      email: 'any_facebook_mail@mail.com',
      facebookId: 'facebook_id'
    })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })
})
