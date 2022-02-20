## Overview

This project is a quick implimentation of an on chain exchange that fascilitates the exchange of ERC20 tokens for Ether and vice versa.

The project has been built with the Ethereum chain in mind.

- The Open Zeppelin library has been used to deploy and interact with the ERC20 tokens.
- The Ethereum development environment of choice is Hardhat, which for the purposes of this project enables one to spin up a local blockchain on which to deploy contracts and test interactions with Hardhat's provided test accounts.

## Getting Started

```
npm install
```

## Running scripts one by one

## STEP 1:

In terminal 1 of 2, spin up a local hardhat blockchain.

```
npx hardhat node
```

## STEP 2:

For the rest of the steps, run the commands in terminal 2 of 2.

Deploy the exchange contract & the ERC20 contract (ADDR 1). To deploy more tokens, use only the second command.

```
npx hardhat run scripts/deployExchange.js --network localhost && npx hardhat run scripts/deployToken.js --network localhost
```

## STEP 3:

Approve the Exchange Contract to transfer the ERC20 tokens to a recipient (ADDR 1). This step should be followed for every token one desires to be able to trade on the exchange.

This step calls the approve function of the ERC20 contract to allow the the exchange contract to transfer (100) tokens to a recipient.
This step also registers the ERC20 on the Exchange contract.

```
npx hardhat run scripts/approveTransfers.js --network localhost
```

## STEP 4:

Register ERC20 as a tradeable asset on the exchange.

```
npx hardhat run scripts/registerToken.js --network localhost
```

## STEP 5:

Create a 'token listing' for 100 tokens (ADDR 1)

This step will list (100) tokens on the exchange (sell order) which can be transferred to a recipient upon placing an order.

```
npx hardhat run scripts/listAsset.js --network localhost

```

## STEP 6:

Place an order for 10 ERC20 tokens (ADDR 2)

This step places an order for (10) tokens (buy order) from Address 2 on the local blockchain and sends the amount the agent placing the order is willing to pay to the contract.

```
npx hardhat run scripts/placeOrder.js --network localhost

```

## STEP 7:

Run the market orchestrator to match orders with available listings and transfer Ether & ERC20 tokens accordingly.

This step looks at existing orders and matches them to compatible listings. The order-listing relationship can be one-to-many, and vice-versa. Orders are closed when they are entirely fulfilled, and listings close when their total allowance is depleted by orders.

```
npx hardhat run scripts/marketOrchestration.js --network localhost

```

## Running the scripts in batches

## STEP 1:

In terminal 1 of 2, spin up a local hardhat blockchain.

```
npx hardhat node
```

## STEP 2:

In terminal 2 of 2, run the below command to excecute the steps 2 - 7 above.

```
npx hardhat run scripts/deployExchange.js --network localhost && npx hardhat run scripts/deployToken.js --network localhost && npx hardhat run scripts/approveTransfers.js --network localhost && npx hardhat run scripts/registerToken.js --network localhost && npx hardhat run scripts/listAsset.js --network localhost && npx hardhat run scripts/placeOrder.js --network localhost && npx hardhat run scripts/marketOrchestration.js --network localhost

```
