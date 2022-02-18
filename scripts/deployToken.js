const { ethers } = require('hardhat')
const fs = require('fs-extra')

async function main() {
  const [deployer] = await ethers.getSigners(0)
  console.log(`Deploying contracts with account ${deployer.address}`)

  const balance = await deployer.getBalance()
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
