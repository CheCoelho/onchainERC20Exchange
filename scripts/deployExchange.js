const { ethers } = require('hardhat')
// const fs = require('fs')
const fs = require('fs-extra')

async function main() {
  const [deployer] = await ethers.getSigners(2)
  console.log(`Deploying contracts with account ${deployer.address}`)

  const balance = await deployer.getBalance()
  console.log(`Account balance: ${balance.toString()}`)

  const Exchange = await ethers.getContractFactory('Exchange')
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
