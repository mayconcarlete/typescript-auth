type HttpResponse = {
  statusCode: number
  data: any
}
class FacebookLoginController {
  async handle (httpRequest: any): Promise<HttpResponse> {
    return new Promise((resolve, reject) => {
      resolve({
        statusCode: 400,
        data: new Error('Token field is required')
      })
    })
  }
}

describe('FacebookLoginController', () => {
  it('should return 400 if token is empty', async () => {
    const sut = new FacebookLoginController()
    const response = await sut.handle({ token: '' })
    expect(response).toEqual({
      statusCode: 400,
      data: new Error('Token field is required')
    })
  })
  it('should return 400 if token is null', async () => {
    const sut = new FacebookLoginController()
    const response = await sut.handle({ token: null })
    expect(response).toEqual({
      statusCode: 400,
      data: new Error('Token field is required')
    })
  })
})
