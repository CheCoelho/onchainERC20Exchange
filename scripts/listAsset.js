const { ethers } = require('hardhat')
var ExchangeDeploymentData = require('../instance/Exchange.json')

//Set Listing Params:
const _tokenId = 0 //Index of the mapping where the token addresses are stored
const _allownace = 100 //Number of tokens to be listed
const _pricePerToken = 3 //Price in wei for a single token

async function main() {
  const ExchangeCurrentDeployment = ExchangeDeploymentData.currentDeployment

  const Exchange = await ethers.getContractFactory('Exchange')

  const exchangeContract = Exchange.attach(ExchangeCurrentDeployment)
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
