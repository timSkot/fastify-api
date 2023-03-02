import { IListingModel } from '../interface/ListingInterface.js'
import Sequelize, { Model, Optional } from 'sequelize'
import { sequelize } from '../utils/database.js'

type ListingCreationAttributes = Optional<IListingModel, 'id'>

interface ListingInstance extends Model<IListingModel, ListingCreationAttributes>, IListingModel {
  createdAt?: Date
  updatedAt?: Date
  error?: object
}

const Listing = sequelize.define<ListingInstance>('Listings', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  model: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  type: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  color: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  year: {
    allowNull: false,
    type: Sequelize.INTEGER,
    validate: {
      isInt: true,
    },
  },
})

export default Listing
