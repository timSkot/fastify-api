import fastify from 'fastify'
import { Op } from 'sequelize'
import { IListing, IListingModel } from './interface/ListingInterface.js'
import { sequelize } from './utils/database.js'
import Listing from './models/listingModel.js'

const PORT: any = process.env.PORT || 8080
const server = fastify()

// Get listing
const getListings = async (params: IListingModel) => {
  try {
    const { id, model, type, color, year } = params

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

      if (listings.length) return listings.map((x) => x.dataValues)
      return null
    } else {
      const listings = await Listing.findAll({
        order: [['year', 'DESC']],
      })

      if (listings.length) return listings.map((x) => x.dataValues)
      return null
    }
  } catch (e) {
    console.error(e)
  }
}

// Create listing
const addListing = async (params: IListingModel) => {
  try {
    const { model, type, color, year } = params
    return await Listing.create({ model, type, color, year })
  } catch (err: any) {
    const errObj: any = {}
    err.errors.map((er: { path: string | number; message: any }) => {
      errObj[er.path] = er.message
    })
    return {
      error: errObj,
    }
  }
}

// Delete listing
const deletedListing = async (params: IListingModel) => {
  try {
    const { id } = params
    const listings = await Listing.findAll({
      where: {
        id: id,
      },
    })
    const listing = listings[0]
    await listing.destroy()
    return
  } catch (err) {
    return {
      error: 'invalid id',
    }
  }
}

server.post<{
  Body: IListing
}>('/api', async (req, res) => {
  const { id, method, params, jsonrpc } = req.body

  const response: { jsonrpc: string; id: number; result?: object; error?: object } = { jsonrpc: jsonrpc, id: id }

  switch (method) {
    case 'getListings':
      const listings = await getListings(params)
      if (!listings) {
        response.error = { message: 'listings not found' }
        return res.status(200).send(response)
      }
      response.result = { listings }
      return res.status(200).send(response)

    case 'addListing':
      const listing = await addListing(params)
      if (listing.error) {
        response.error = { message: listing.error }
        return res.status(200).send(response)
      }
      response.result = { listing }
      return res.status(201).send(response)

    case 'deleteListing':
      const deleteListing = await deletedListing(params)

      if (deleteListing === undefined) {
        response.error = { message: 'something went wrong' }
        return res.status(200).send(response)
      } else if (deleteListing?.error) {
        response.error = { message: deleteListing.error }
        return res.status(200).send(response)
      }
      response.result = { message: `${id} was deleted` }
      return res.status(200).send(response)
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
