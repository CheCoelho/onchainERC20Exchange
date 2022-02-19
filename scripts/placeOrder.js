const { ethers } = require('hardhat')
var TokenDeploymentData = require('../instance/Token.json')
var ExchangeDeploymentData = require('../instance/Exchange.json')
const ExchangeCurrentDeployment = ExchangeDeploymentData.currentDeployment
require('dotenv').config()

privateKey2 = process.env.PRIVATE_KEY2

const provider = new ethers.providers.JsonRpcProvider() // using default http://localhost:8545
const signer = new ethers.Wallet(
  '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
  provider
)
async function main() {
  const myContract = await ethers.getContractAt(
    'Exchange',
    ExchangeCurrentDeployment,
    signer
  )
  await myContract.placeOrder(0, 10, { value: ethers.utils.parseEther('0.01') })
  const out = await myContract.getOrder(1)
  console.log(out)
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
