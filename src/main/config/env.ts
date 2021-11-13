export default {
  environment: process.env.ENVIRONMENT ?? 'development',
  appPort: process.env.PORT ?? 3000,
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '3123828511234482',
    client_secret: process.env.FB_CLIENT_SECRET ?? '6e111b60c26f6af4b883e23ca451664a'
  },
  jwtSecret: process.env.JWT_SECRET ?? 'abc_123'
}
