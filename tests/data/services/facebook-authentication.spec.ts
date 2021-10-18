import { mock, MockProxy } from 'jest-mock-extended'

import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repository'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let loadFacebookUserMock: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
  let createFacebookAccountRepository: MockProxy<CreateFacebookAccountRepository>

  beforeEach(() => {
    loadFacebookUserMock = mock()
    loadFacebookUserMock.loadUser.mockResolvedValue({
      name: ' any_facebook_name',
      email: 'any_facebook_mail@mail.com',
      facebookId: 'facebook_id'
    })

    loadUserAccountRepository = mock()
    loadUserAccountRepository.load.mockResolvedValue(undefined)

    createFacebookAccountRepository = mock()

    sut = new FacebookAuthenticationService(loadFacebookUserMock, loadUserAccountRepository, createFacebookAccountRepository)
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserMock.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserMock.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
    loadFacebookUserMock.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token: 'invalid_token' })
    expect(authResult).toEqual({ result: new AuthenticationError() })
  })

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token: 'valid_token' })

    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({ email: 'any_facebook_mail@mail.com' })
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateFacebookAccountRepository when LoadUserAccountRepository returns undefined', async () => {
    await sut.perform({ token: 'valid_token' })
    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      name: ' any_facebook_name',
      email: 'any_facebook_mail@mail.com',
      facebookId: 'facebook_id'
    })
    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
