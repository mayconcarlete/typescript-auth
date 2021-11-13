import { AccountRepository, FacebookAccount, FacebookData } from '@/domain/entities'

describe('FacebookAccount', () => {
  const facebookParams: FacebookData = {
    name: 'any_facebook_name',
    email: 'any_facebook_mail@mail.com',
    facebookId: 'facebook_id'
  }
  it('should create with facebook data only', () => {
    const sut = new FacebookAccount(facebookParams)

    expect(sut).toEqual(facebookParams)
  })

  it('should update name if its empty in userAccountParams', () => {
    const userAccountParams: AccountRepository = { id: 'valid_id' }
    const sut = new FacebookAccount(facebookParams, userAccountParams)

    expect(sut).toEqual({
      id: userAccountParams.id,
      name: facebookParams.name,
      email: facebookParams.email,
      facebookId: facebookParams.facebookId
    })
  })

  it('should not update name if its already exists in userAccountParams', () => {
    const userAccountParams: AccountRepository = { id: 'valid_id', name: 'valid_name' }
    const sut = new FacebookAccount(facebookParams, userAccountParams)

    expect(sut).toEqual({
      id: userAccountParams.id,
      name: userAccountParams.name,
      email: facebookParams.email,
      facebookId: facebookParams.facebookId
    })
  })
})
