import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repository'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'

class LoadFacebookUserSpy implements LoadFacebookUserApi {
  token?: string
  count=0
  result: LoadFacebookUserApi.Result = undefined
  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    this.count++
    return new Promise((resolve, reject) => {
      resolve(this.result)
    })
  }
}

class LoadUserAccountRepositorySpy implements LoadUserAccountRepository {
  params={}
  count=0
  result = undefined
  async load (params: LoadUserAccountRepository.Params): Promise<void> {
    this.params = params
    this.count++
    return this.result
  }
}

class CreateFacebookAccountRepositorySpy implements CreateFacebookAccountRepository {
  params = {}
  count =0
  async createFromFacebook (params: CreateFacebookAccountRepository.Params): Promise<void> {
    this.params = params
    this.count++
  }
}

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let loadFacebookUserApi: LoadFacebookUserSpy
  let loadUserAccountRepository: LoadUserAccountRepositorySpy
  let createFacebookAccountRepository: CreateFacebookAccountRepositorySpy

  beforeEach(() => {
    loadFacebookUserApi = new LoadFacebookUserSpy()
    loadFacebookUserApi.result = {
      name: ' any_facebook_name',
      email: 'any_facebook_mail@mail.com',
      facebookId: 'facebook_id'
    }
    loadUserAccountRepository = new LoadUserAccountRepositorySpy()
    createFacebookAccountRepository = new CreateFacebookAccountRepositorySpy()
    sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepository, createFacebookAccountRepository)
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApi.token).toBe('any_token')
    expect(loadFacebookUserApi.count).toBe(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
    loadFacebookUserApi.result = undefined
    const authResult = await sut.perform({ token: 'invalid_token' })
    expect(authResult).toEqual({ result: new AuthenticationError() })
  })

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token: 'valid_token' })
    expect(loadUserAccountRepository.params).toEqual({ email: 'any_facebook_mail@mail.com' })
    expect(loadUserAccountRepository.count).toBe(1)
  })

  it('should call CreateFacebookAccountRepository when LoadUserAccountRepository returns undefined', async () => {
    await sut.perform({ token: 'valid_token' })
    expect(createFacebookAccountRepository.params).toEqual({
      name: ' any_facebook_name',
      email: 'any_facebook_mail@mail.com',
      facebookId: 'facebook_id'
    })
    expect(createFacebookAccountRepository.count).toBe(1)
  })
})
