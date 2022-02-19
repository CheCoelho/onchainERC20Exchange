const { ethers } = require('hardhat')
const fs = require('fs-extra')
var TokenDeploymentData = require('../instance/Token.json')
var ExchangeDeploymentData = require('../instance/Exchange.json')

async function main() {
  const TokenCurrentDeployment = TokenDeploymentData.currentDeployment
  const ExchangeCurrentDeployment = ExchangeDeploymentData.currentDeployment
  const Exchange = await ethers.getContractFactory('Exchange')
  const exchangeContract = Exchange.attach(ExchangeCurrentDeployment)

  const [addr1, addr2, addr3] = await ethers.getSigners()
  console.log(`Deploying contracts with account ${addr1.address}`)

  const balance = await addr1.getBalance()
  console.log(`Account balance: ${balance.toString()}`)

  const Token = await ethers.getContractFactory('Token')
  const token = await Token.deploy('Test', 'TST')
  console.log(`Token address: ${token.address}`)
  await createDeploymentInstance(token.address, 'Token')

  const data = {
    address: token.address,
    abi: JSON.parse(token.interface.format('json')),
  }
  fs.writeFileSync('abi/Token.json', JSON.stringify(data))

  // try {
  //   const tokenContract = Token.attach(TokenCurrentDeployment)

  //   await tokenContract.approve(ExchangeCurrentDeployment, 100)
  //   let approved = await token.allowance(
  //     addr1.address,
  //     ExchangeCurrentDeployment
  //   )
  //   console.log(
  //     `Token owner has allowed the Exchange contract to transfer ${approved.toString()} tokens to buyers.`
  //   )
  // } catch (error) {
  //   console.error(error)
  // }

  // try {
  //   await exchangeContract.registerToken(token.address)
  //   console.log('The token has been registered on the exchange')
  // } catch (error) {
  //   console.log(error)
  // }
}

const createDeploymentInstance = async (contractAddress, name) => {
  try {
    await fs.writeJson(`./instance/${name}.json`, {
      currentDeployment: contractAddress,
    })
    console.log('JSON file created as reference to current deployment')
  } catch (err) {
    console.error(err)
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
