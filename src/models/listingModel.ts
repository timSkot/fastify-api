import { IListing } from '../interface/ListingInterface.js'
import Sequelize, { Model, Optional } from 'sequelize'
import { sequelize } from '../utils/database.js'

type ListingCreationAttributes = Optional<IListing, 'id'>

interface ListingInstance extends Model<IListing, ListingCreationAttributes>, IListing {
  createdAt?: Date
  updatedAt?: Date
}

const Listing = sequelize.define<ListingInstance>('Listings', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  model: {
    allowNull: true,
    type: Sequelize.STRING,
  },
  type: {
    allowNull: true,
    type: Sequelize.STRING,
  },
  color: {
    allowNull: true,
    type: Sequelize.STRING,
  },
  year: {
    allowNull: true,
    type: Sequelize.INTEGER,
    validate: {
      isInt: true,
    },
  },
})

export default Listing
