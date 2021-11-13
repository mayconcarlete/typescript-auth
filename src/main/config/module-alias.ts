import { addAlias } from 'module-alias'
import { resolve } from 'path'
import envFile from './env'

if (envFile.environment === 'production') {
  addAlias('@', resolve('dist/src'))
} else {
  addAlias('@', resolve('src'))
}
