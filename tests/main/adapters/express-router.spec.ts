import { NextFunction, Request, RequestHandler, Response } from 'express'
import { mock, MockProxy } from 'jest-mock-extended'

import { getMockReq, getMockRes } from '@jest-mock/express'
import { Controller } from '@/application/controllers'
import { adaptExpressRoute } from '@/main/adapaters'

describe('ExpressRouter', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let controller: MockProxy<Controller>
  let sut: RequestHandler

  beforeAll(() => {
    req = getMockReq({ body: { any: 'any' } })
    res = getMockRes().res
    next = getMockRes().next
    controller = mock()
    controller.handle.mockResolvedValue({ statusCode: 200, data: { data: 'any_data' } })
  })
  beforeEach(() => {
    sut = adaptExpressRoute(controller)
  })

  it('should call handle with correct request', async () => {
    await sut(req, res, next)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', async () => {
    req = getMockReq()

    await sut(req, res, next)

    expect(controller.handle).toHaveBeenCalledWith({})
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should respond with 200 and valid data', async () => {
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ data: 'any_data' })
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should respond with 400 and a error', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 400,
      data: new Error('any_error')
    })

    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })
})
