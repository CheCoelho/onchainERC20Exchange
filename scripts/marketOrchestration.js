const { ethers } = require('hardhat')
var TokenDeploymentData = require('../instance/Token.json')
var ExchangeDeploymentData = require('../instance/Exchange.json')
const ExchangeCurrentDeployment = ExchangeDeploymentData.currentDeployment
require('dotenv').config()

privateKey2 = process.env.PRIVATE_KEY2

const provider = new ethers.providers.JsonRpcProvider() // using default http://localhost:8545
const signer = new ethers.Wallet(
  '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
  provider
)
async function main() {
  const myContract = await ethers.getContractAt(
    'Exchange',
    ExchangeCurrentDeployment,
    signer
  )

  let orderCount = parseInt(await myContract.totalOrders())

  console.log(`Found ${orderCount} orders.`)
  let orders = []
  for (let i = 0; i < orderCount; i++) {
    let foundOrder = await myContract.getOrder(i)
    orders.push(foundOrder)
  }

  let listingCount = parseInt(await myContract.totalListings())

  console.log(`Found ${listingCount} listings.`)
  let listings = []
  for (let i = 0; i < listingCount; i++) {
    let foundListing = await myContract.getListing(i)
    listings.push(foundListing)
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
