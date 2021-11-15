import { TokenValidator } from '@/domain/contracts/crypto'

type Input = {token: string}
type Output = string
type Setup = (crypto: TokenValidator) => Authorize
export type Authorize = (params: Input) => Promise<Output>

export const setupAuthorize: Setup = crypto => async params => {
  return await crypto.validateToken(params)
}
