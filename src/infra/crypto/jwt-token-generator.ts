import { TokenGenerator } from '@/data/contracts/crypto'
import jwt from 'jsonwebtoken'

export class JwtTokenGenerator implements TokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken (params: TokenGenerator.Params): Promise<string> {
    const expirationInSeconds = params.expirationInMs / 1000
    const token = jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds })
    return token
  }
}
