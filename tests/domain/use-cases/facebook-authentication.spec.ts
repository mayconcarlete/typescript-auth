import { mock, MockProxy } from 'jest-mock-extended'

import { AuthenticationError } from '@/domain/errors'
import { TokenGenerator } from '@/domain/contracts/crypto'
import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/domain/contracts/repository'

jest.mock('@/domain/entities/facebook-account')

describe('FacebookAuthentication', () => {
  let token: string
  let facebookData: LoadFacebookUserApi.Result
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let crypto: MockProxy<TokenGenerator>
  let sut: FacebookAuthentication

  beforeAll(() => {
    token = 'any_token'

    facebookData = {
      name: 'any_facebook_name',
      email: 'any_facebook_mail@mail.com',
      facebookId: 'facebook_id'
    }
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue(facebookData)

    userAccountRepository = mock()
    userAccountRepository.load.mockResolvedValue(undefined)
    userAccountRepository.saveWithFacebook.mockResolvedValue({ id: 'valid_id' })

    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    sut = setupFacebookAuthentication(facebookApi, userAccountRepository, crypto)
  })

  it('should call facebook.loadUser with correct params', async () => {
    await sut({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should throw AuthenticationError when facebookApi.loadUser return undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    await expect(sut({ token })).rejects.toThrow(new AuthenticationError())
  })

  it('should call userAccountRepository.load when facebookApi.loadUser returns data', async () => {
    await sut({ token })

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_facebook_mail@mail.com' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call SaveFacebookAccountRepository with facebookAccount', async () => {
    await sut({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith(expect.any(FacebookAccount))
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut({ token })

    expect(crypto.generateToken).toHaveBeenLastCalledWith({
      key: 'valid_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  it('should return an access token on success', async () => {
    const authResult = await sut({ token })

    expect(authResult).toEqual({ token: 'any_generated_token' })
  })

  it('should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('facebook_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('facebook_error'))
  })

  it('should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('should rethrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('should rethrow if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
