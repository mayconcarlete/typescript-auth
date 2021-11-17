import jwt from 'jsonwebtoken'

import { JwtTokenHandler } from '@/infra/crypto'

jest.mock('jsonwebtoken')

describe('JwtTokenHandler', () => {
  let fakeJwt: jest.Mocked<typeof jwt>
  let sut: JwtTokenHandler
  let secret: string

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    secret = 'any_secret'
  })

  beforeEach(() => {
    sut = new JwtTokenHandler('any_secret')
  })

  describe('JwtTokenHandler.generateToken', () => {
    let key: string
    let token: string
    let expirationInMs: number

    beforeAll(() => {
      key = 'any_key'
      token = 'any_token'
      expirationInMs = 1000
      fakeJwt.sign.mockImplementation(() => token)
    })
    it('should call sign with correct params', async () => {
      await sut.generateToken({ key, expirationInMs })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })

    it('should return a token', async () => {
      const generatedToken = await sut.generateToken({ key, expirationInMs })

      expect(generatedToken).toBe(token)
    })

    it('should rethrows if sign throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => {
        throw new Error('token error')
      })
      const promise = sut.generateToken({ key, expirationInMs })

      await expect(promise).rejects.toThrow(new Error('token error'))
    })
  })

  describe('JwtTokenHandler.validateToken', () => {
    let token: string
    let key: string

    beforeAll(() => {
      token = 'any_token'
      key = 'any_key'
      fakeJwt.sign.mockImplementation(() => token)
      fakeJwt.verify.mockImplementation(() => ({
        key
      }))
    })
    it('should call sign with correct params', async () => {
      await sut.validateToken({ token })

      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret)
    })

    it('should return the key used to sign', async () => {
      const generatedKey = await sut.validateToken({ token })
      expect(generatedKey).toBe(key)
    })

    it('should rethrows if verify throws', async () => {
      fakeJwt.verify.mockImplementationOnce(() => {
        throw new Error('verify error')
      })
      const promise = sut.validateToken({ token })

      await expect(promise).rejects.toThrow(new Error('verify error'))
    })

    it('should throw if verify returns null', async () => {
      fakeJwt.verify.mockImplementationOnce(() => null)
      const promise = sut.validateToken({ token })

      await expect(promise).rejects.toThrow()
    })
  })
})
