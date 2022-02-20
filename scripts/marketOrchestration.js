const { ethers } = require('hardhat')
var ExchangeDeploymentData = require('../instance/Exchange.json')
var TokenDeploymentData = require('../instance/Token.json')

const ExchangeCurrentDeployment = ExchangeDeploymentData.currentDeployment
const TokenCurrentDeployment = TokenDeploymentData.currentDeployment
const accountTwoPrivateKey =
  '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'

const provider = new ethers.providers.JsonRpcProvider() // using default http://localhost:8545
const signer = new ethers.Wallet(accountTwoPrivateKey, provider)
async function main() {
  const exchangeContract = await ethers.getContractAt(
    'Exchange',
    ExchangeCurrentDeployment,
    signer
  )
  const tokenContract = await ethers.getContractAt(
    'Token',
    TokenCurrentDeployment,
    signer
  )

  let orderCount = parseInt(await exchangeContract.totalOrders())

  console.log(`Found ${orderCount} orders.`)
  let orders = []
  for (let i = 0; i < orderCount; i++) {
    const foundOrder = await exchangeContract.getOrder(i)
    orders.push(foundOrder)
  }

  let listingCount = parseInt(await exchangeContract.totalListings())

  console.log(`Found ${listingCount} listings.`)
  let listings = []
  for (let i = 0; i < listingCount; i++) {
    const foundListing = await exchangeContract.getListing(i)
    listings.push(foundListing)
  }

  for (let orderIndex in orders) {
    const order = orders[orderIndex]
    if (order['closed']) {
      continue
    }
    for (let listingIndex in listings) {
      const listing = listings[listingIndex]
      if (listing['emptied']) {
        continue
      }
      if (order['token'] === listing['token']) {
        if (order['funding'] >= listing['pricePerToken'] * order['amount']) {
          console.log('Executing trade...')
          await exchangeContract.triggerOrderFullfillment(
            orderIndex,
            listingIndex,
            order['amount'],
            order['token']
          )
        }
        const updatedOrderAgentTokens = await tokenContract.balanceOf(
          order['agent']
        )
        const tokenName = await tokenContract.name()
        const tokenSymbol = await tokenContract.symbol()

        console.log(
          `Agent who placed order now has ${updatedOrderAgentTokens} ${tokenName}(${tokenSymbol}) tokens.`
        )
        console.log(
          `The listing agent received ${
            listing['pricePerToken'] * order['amount']
          } wei for ${order['amount']} ${tokenName}(${tokenSymbol}) tokens.`
        )
        // const orderTest = await exchangeContract.getOrder(order['id'])
        // console.log(orderTest)
        // const listingTest = await exchangeContract.getListing(listing['id'])
        // console.log(listingTest)
      }
    }
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
