const { ethers } = require('hardhat')
var ExchangeDeploymentData = require('../instance/Exchange.json')

async function main() {
  const ExchangeCurrentDeployment = ExchangeDeploymentData.currentDeployment

  const Exchange = await ethers.getContractFactory('Exchange')

  const exchangeContract = Exchange.attach(ExchangeCurrentDeployment)
  try {
    test = await exchangeContract.listAsset(0, 100, 1)
    console.log(test)
    let listing = await exchangeContract.getListing(0)
    console.log(listing)
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
