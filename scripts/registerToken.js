const { ethers } = require('hardhat')
var TokenDeploymentData = require('../instance/Token.json')
var ExchangeDeploymentData = require('../instance/Exchange.json')

async function main() {
  const TokenCurrentDeployment = TokenDeploymentData.currentDeployment
  const ExchangeCurrentDeployment = ExchangeDeploymentData.currentDeployment

  const Exchange = await ethers.getContractFactory('Exchange')

  const exchangeContract = Exchange.attach(ExchangeCurrentDeployment)

  try {
    await exchangeContract.registerToken(TokenCurrentDeployment)
    console.log('The token has been registered on the exchange')
  } catch (error) {
    console.log(error)
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
