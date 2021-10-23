import { mock, MockProxy } from 'jest-mock-extended'

import { AuthenticationError } from '@/domain/errors'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { FacebookAuthenticationService } from '@/data/services'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repository'
import { TokenGenerator } from '@/data/contracts/crypto'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let crypto: MockProxy<TokenGenerator>

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
    userAccountRepository.saveWithFacebook.mockResolvedValue({ id: 'valid_id' })

    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_generated_token')

    sut = new FacebookAuthenticationService(facebookApi, userAccountRepository, crypto)
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
    await sut.perform({ token: 'valid_token' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith(expect.any(FacebookAccount))
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform({ token: 'valid_token' })
    expect(crypto.generateToken).toHaveBeenLastCalledWith({
      key: 'valid_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  it('should return an access token on success', async () => {
    const authResult = await sut.perform({ token: 'valid_token' })
    expect(authResult).toEqual({ result: new AccessToken('any_generated_token') })
  })

  it('should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('facebook_error'))
    const promise = sut.perform({ token: 'valid_token' })
    await expect(promise).rejects.toThrow(new Error('facebook_error'))
  })

  it('should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_error'))
    const promise = sut.perform({ token: 'valid_token' })
    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut.perform({ token: 'valid_token' })
    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('should rethrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut.perform({ token: 'valid_token' })
    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('should rethrow if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'))
    const promise = sut.perform({ token: 'valid_token' })
    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
