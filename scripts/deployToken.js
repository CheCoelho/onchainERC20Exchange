const { ethers } = require('hardhat')
const fs = require('fs-extra')

async function main() {
  const [addr1, addr2, addr3] = await ethers.getSigners()
  console.log(`Deploying contracts with account ${addr1.address}`)

  const Token = await ethers.getContractFactory('Token')
  const token = await Token.deploy('Test', 'TST') //Set Token Name & Symbol Here
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
