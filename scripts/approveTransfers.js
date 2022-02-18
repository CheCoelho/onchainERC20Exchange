const { ethers } = require('hardhat')
var TokenDeploymentData = require('../instance/Token.json')
var ExchangeDeploymentData = require('../instance/Exchange.json')

async function main() {
  const TokenCurrentDeployment = TokenDeploymentData.currentDeployment
  const ExchangeCurrentDeployment = ExchangeDeploymentData.currentDeployment

  const [lister] = await ethers.getSigners(0)
  console.log(lister.address)

  const Token = await ethers.getContractFactory('Token')
  const Exchange = await ethers.getContractFactory('Exchange')

  const tokenContract = await Token.attach(TokenCurrentDeployment)
  const exchangeContract = await Exchange.attach(ExchangeCurrentDeployment)

  try {
    await tokenContract.approve(ExchangeCurrentDeployment, 100)
    let approved = await tokenContract.allowance(
      lister.address,
      ExchangeCurrentDeployment
    )
    console.log(
      `Token owner has allowed the Exchange contract to transfer ${approved.toString()} tokens to buyers.`
    )
  } catch (error) {
    console.error(error)
  }

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
