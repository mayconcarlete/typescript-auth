import axios from 'axios'

import { HttpGetClient } from '@/infra/http'

export class AxiosHttpClient implements HttpGetClient {
  async get <T = any>(args: HttpGetClient.Params): Promise<T> {
    return await axios.get(args.url, { params: args.params })
  }
}
