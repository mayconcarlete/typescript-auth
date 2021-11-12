import { app } from '@/main/config/app'

import { IBackup } from 'pg-mem'
import { getConnection } from 'typeorm'
import request from 'supertest'
import { makeFakeDb } from '../../infra/postgres/mocks'
import { PgUser } from '@/infra/postgres/entities'

describe('Login Routes', () => {
  describe('POST /login/facebook', () => {
    let backup: IBackup
    const loadUserSpy = jest.fn()

    jest.mock('@/infra/apis/facebook', () => ({
      FacebookApi: jest.fn().mockReturnValue({ loadUser: loadUserSpy })
    }))

    beforeAll(async () => {
      const db = await makeFakeDb([PgUser])
      backup = db.backup()
    })

    afterAll(async () => {
      await getConnection().close()
    })

    beforeEach(() => {
      backup.restore()
    })

    it('should return 200 with AccessToken', async () => {
      loadUserSpy.mockResolvedValueOnce({ facebookId: 'any_id', name: 'any_name', email: 'any_email' })

      const { status, body } = await request(app)
        .post('/api/v1/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(200)
      expect(body.accessToken).toBeDefined()
    })
  })
})
