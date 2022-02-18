const { ethers } = require('hardhat')
var ExchangeDeploymentData = require('../instance/Exchange.json')

async function main() {
  const ExchangeCurrentDeployment = ExchangeDeploymentData.currentDeployment

  const [lister] = await ethers.getSigners(0)
  console.log(lister.address)

  const Exchange = await ethers.getContractFactory('Exchange')

  const exchangeContract = await Exchange.attach(ExchangeCurrentDeployment)
  try {
    await exchangeContract.listAsset(0, 100, 1)
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
