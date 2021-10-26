import axios from 'axios'
import { HttpGetClient } from '@/infra/http'

jest.mock('axios')

class AxiosHttpClient implements HttpGetClient {
  async get <T = any>(args: HttpGetClient.Params): Promise<T> {
    return await axios.get(args.url, { params: args.params })
  }
}

describe('AxiosHttpClient', () => {
  let fakeAxios: jest.Mocked<typeof axios>
  let sut: AxiosHttpClient
  let url: string
  let params: object
  let successResponse: object

  beforeAll(() => {
    params = { any: 'any' }
    url = 'any_url'
    fakeAxios = axios as jest.Mocked<typeof axios>
    successResponse = {
      status: 200,
      data: 'any_data'
    }
    fakeAxios.get.mockResolvedValue(successResponse)
  })

  beforeEach(() => {
    sut = new AxiosHttpClient()
  })

  describe('get', () => {
    it('should call get with correct params', async () => {
      await sut.get({ url, params })

      expect(fakeAxios.get).toHaveBeenCalledWith('any_url', { params })
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })

    it('should rethrow if axios get throws', async () => {
      fakeAxios.get.mockRejectedValueOnce(new Error('http_error'))
      const promise = sut.get({ url, params })

      await expect(promise).rejects.toThrow(new Error('http_error'))
    })

    it('should return data on success', async () => {
      const result = await sut.get({ url, params })

      expect(result).toEqual(successResponse)
    })
  })
})
