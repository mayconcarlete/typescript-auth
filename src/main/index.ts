import './config/module-alias'
import 'reflect-metadata'
import { app } from './config/app'

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000')
})
