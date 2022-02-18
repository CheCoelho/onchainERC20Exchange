require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-web3')

require
require('dotenv').config()

privateKey = process.env.PRIVATE_KEY
network = process.env.RINKBY_INFURA_ENDPOINT

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('balance', "Prints an account's balance")
  .addParam('account', "The account's address")
  .setAction(async (taskArgs) => {
    const account = web3.utils.toChecksumAddress(taskArgs.account)
    const balance = await web3.eth.getBalance(account)

    console.log(web3.utils.fromWei(balance, 'ether'), 'ETH')
  })

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.12',
  networks: {
    rinkeby: {
      url: network,
      accounts: [`0x${privateKey}`],
    },
  },
}
