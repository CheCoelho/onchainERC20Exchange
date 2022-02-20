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

  const exchange = await Exchange.deploy()
  console.log(`Exchange address: ${exchange.address}`)
  await createDeploymentInstance(exchange.address, 'Exchange')

  const data = {
    address: exchange.address,
    abi: JSON.parse(exchange.interface.format('json')),
  }
  fs.writeFileSync('abi/Exchange.json', JSON.stringify(data))
}
const createDeploymentInstance = async (contractAddress, name) => {
  try {
    await fs.writeJson(`./instance/${name}.json`, {
      currentDeployment: contractAddress,
    })
    console.log(
      `JSON file created as reference to current deployment with name: ${name}.json`
    )
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
