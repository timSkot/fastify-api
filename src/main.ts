import fastify from 'fastify'
import { Op } from 'sequelize'
import { IListing, IQueryDelete } from './interface/ListingInterface.js'
import { sequelize } from './utils/database.js'
import Listing from './models/listingModel.js'

const PORT: any = process.env.PORT || 8080
const server = fastify()

// Get listings
server.get<{
  Querystring: IListing
}>('/api/listings', async (req, res) => {
  const { id, model, type, color, year } = req.query
  let resMsg

  if (id || model || type || color || year) {
    const listings = await Listing.findAll({
      where: {
        [Op.and]: [
          id ? { id } : {},
          model ? { model } : {},
          type ? { type } : {},
          color ? { color } : {},
          year ? { year } : {},
        ],
      },
      order: [['year', 'DESC']],
    })
    if (listings.length) {
      resMsg = listings
    } else {
      resMsg = 'Cars not found'
    }
    res.status(200).send(resMsg)
  } else {
    const listings = await Listing.findAll({
      order: [['year', 'DESC']],
    })
    res.status(200).send(listings)
  }
})

// Create listing
server.post<{ Body: IListing; Reply: object }>('/api/add', async (req, res) => {
  try {
    const { model, type, color, year } = req.body
    const listing = await Listing.create({ model, type, color, year })
    res.status(201).send(listing)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Delete listing
server.delete<{ Querystring: IQueryDelete; Reply: unknown }>('/api/delete/:id', async (req, res) => {
  try {
    const { id } = req.query
    const listings = await Listing.findAll({
      where: {
        id: id,
      },
    })
    const listing = listings[0]
    await listing.destroy()
    res.status(202).send('Deleted')
  } catch (e) {
    res.status(500).send(e)
  }
})

const start = async () => {
  try {
    await sequelize.sync()
    server.listen(PORT)
    console.log('Server started successfully')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()
