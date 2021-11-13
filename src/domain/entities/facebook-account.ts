export type FacebookData = {
  email: string
  name: string
  facebookId: string
}

export type AccountRepository = {
  id?: string
  name?: string
}
export class FacebookAccount {
  id?: string
  name: string
  email: string
  facebookId: string

  constructor (facebookData: FacebookData, accountRepository?: AccountRepository) {
    this.id = accountRepository?.id
    this.email = facebookData.email
    this.name = accountRepository?.name ?? facebookData.name
    this.facebookId = facebookData.facebookId
  }
}
