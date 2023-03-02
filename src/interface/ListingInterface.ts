export interface IListing {
  id: number
  jsonrpc: string
  method: string
  params: object
}
export interface IListingModel {
  id?: number
  model?: string
  type?: string
  color?: string
  year?: number
}
