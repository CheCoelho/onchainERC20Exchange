const { ethers } = require('hardhat')
var TokenDeploymentData = require('../instance/Token.json')
var ExchangeDeploymentData = require('../instance/Exchange.json')

async function main() {
  const TokenCurrentDeployment = TokenDeploymentData.currentDeployment
  const ExchangeCurrentDeployment = ExchangeDeploymentData.currentDeployment

  const [addr1] = await ethers.getSigners()

  const Token = await ethers.getContractFactory('Token')

  const tokenContract = Token.attach(TokenCurrentDeployment)

  try {
    await tokenContract.approve(ExchangeCurrentDeployment, 100)
    let approved = await tokenContract.allowance(
      addr1.address,
      ExchangeCurrentDeployment
    )
    console.log(
      `Token owner has allowed the Exchange contract to transfer ${approved.toString()} tokens to buyers.`
    )
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
