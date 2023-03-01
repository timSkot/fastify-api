import { Sequelize } from 'sequelize'

const SCHEMA_NAME = 'listings'
const USER_NAME = 'root'
const PASSWORD = 'caching_sha2_password'

const sequelize = new Sequelize(SCHEMA_NAME, USER_NAME, PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
})

export { sequelize }
