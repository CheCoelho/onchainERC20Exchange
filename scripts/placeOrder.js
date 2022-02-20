const { ethers } = require('hardhat')
var ExchangeDeploymentData = require('../instance/Exchange.json')
const ExchangeCurrentDeployment = ExchangeDeploymentData.currentDeployment

//Set Order Params:
const _tokenId = 0 //Index of the mapping where the token addresses are stored
const _amount = 10 //Number of tokens to be listed
const _pricePerToken = 3 //Price in wei for a single token
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
  let lastOrder = await exchangeContract.totalOrders()

  let orderTx = await exchangeContract.placeOrder(_tokenId, _amount, {
    value: _amount * _pricePerToken,
  })
  try {
    const order = await exchangeContract.getOrder(lastOrder)

    console.log(`Order successfully placed on the exchange: \n 
    Order ID: ${order['id']} \n
    Token Address: ${order['token']} \n
    Ordered By: ${order['agent']} \n
    Total Tokens Fulfilled: ${order['fulfilled']} \n
    Total Tokens Ordered: ${order['amount']} \n
    Total Funding: ${order['funding']} \n
    Closed: ${order['closed']} \n`)
  } catch (error) {
    console.error(error)
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
