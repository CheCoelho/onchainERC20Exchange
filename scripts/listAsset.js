const { ethers } = require('hardhat')
var ExchangeDeploymentData = require('../instance/Exchange.json')
const ExchangeCurrentDeployment = ExchangeDeploymentData.currentDeployment

//Set Listing Params:
const _tokenId = 0 //Index of the mapping where the token addresses are stored
const _allownace = 100 //Number of tokens to be listed
const _pricePerToken = 3 //Price in wei for a single token
const accountOnePrivateKey =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

const provider = new ethers.providers.JsonRpcProvider() // using default http://localhost:8545
const signer = new ethers.Wallet(accountOnePrivateKey, provider)
async function main() {
  const exchangeContract = await ethers.getContractAt(
    'Exchange',
    ExchangeCurrentDeployment,
    signer
  )

  try {
    let lastListing = await exchangeContract.totalListings()

    let listingTx = await exchangeContract.listAsset(
      _tokenId,
      _allownace,
      _pricePerToken
    )
    const listing = await exchangeContract.getListing(parseInt(lastListing))
    console.log(`Listing successfully registered on the exchange: \n 
    Token Address: ${listing[0]} \n
    Listed By: ${listing[1]} \n
    Total Tokens Listed: ${listing[2]} \n
    Avalaible Tokens: ${listing[3]} \n
    Price Per Token: ${listing[4]} \n
    Emptied: ${listing[5]} \n`)
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
