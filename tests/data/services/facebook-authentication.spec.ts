import { mock, MockProxy } from 'jest-mock-extended'

import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '@/data/contracts/repository'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository>

  const facebookData = {
    name: ' any_facebook_name',
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

  it('should call userAccountRepository.createFromFacebook when userAccountRepository.load returns undefined', async () => {
    await sut.perform({ token: 'valid_token' })
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      name: ' any_facebook_name',
      email: 'any_facebook_mail@mail.com',
      facebookId: 'facebook_id'
    })
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call userAccountRepository.updateWithFacebook when userAccountRepository.load returns data', async () => {
    userAccountRepository.load.mockResolvedValueOnce({ id: 'valid_id', name: 'valid_name' })
    await sut.perform({ token: 'valid_token' })
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledWith({
      id: 'valid_id',
      name: 'valid_name',
      facebookId: 'facebook_id'
    })
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledTimes(1)
  })
})
