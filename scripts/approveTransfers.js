const { ethers } = require('hardhat')
var TokenDeploymentData = require('../instance/Token.json')
var ExchangeDeploymentData = require('../instance/Exchange.json')

async function main() {
  const TokenCurrentDeployment = TokenDeploymentData.currentDeployment
  const ExchangeCurrentDeployment = ExchangeDeploymentData.currentDeployment

  const [addr1, owner, lister] = await ethers.getSigners()
  console.log(lister.address)

  const Token = await ethers.getContractFactory('Token')
  const Exchange = await ethers.getContractFactory('Exchange')

  const tokenContract = Token.attach(TokenCurrentDeployment)
  const exchangeContract = Exchange.attach(ExchangeCurrentDeployment)

  try {
    test = await tokenContract.balanceOf(addr1.address)
    console.log('TEST', test)
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
