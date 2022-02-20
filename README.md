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

Deploy the exchange contract & the ERC20 contract (ADDR 1)

```
npx hardhat run scripts/deployExchange.js --network localhost && npx hardhat run scripts/deployToken.js --network localhost
```

## STEP 3:

Approve the Exchange Contract to transfer the ERC20 tokens to a recipient (ADDR 1)

This step calls the approve function of the ERC20 contract to allow the the exchange contract to transfer (100) tokens to a recipient.
This step also registers the ERC20 on the Exchange contract.

```
npx hardhat run scripts/approveTransfers.js --network localhost
```

## STEP 4:

Create a 'token listing' for 100 tokens (ADDR 1)

This step will list (100) tokens on the exchange which can be transferred to a recipient upon placing an order.

```
npx hardhat run scripts/listAsset.js --network localhost

```

## STEP 5:

Place an order for 10 ERC20 tokens (ADDR 2)

This step places an order for (10) tokens from Address 2 on the local blockchain and sends the max amount the agent placing the order is willing to pay to the contract.

```
npx hardhat run scripts/placeOrder.js --network localhost

```

## STEP 6:

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

In terminal 2 of 2, run the below command to excecute the steps 2 - 6 above.

```
npx hardhat run scripts/deployExchange.js --network localhost && npx hardhat run scripts/deployToken.js --network localhost && npx hardhat run scripts/approveTransfers.js --network localhost && npx hardhat run scripts/listAsset.js --network localhost && npx hardhat run scripts/placeOrder.js --network localhost && npx hardhat run scripts/marketOrchestration.js --network localhost

```

## Adding further orders and listings

More orders and listings can easily be added by running steps 4 & 5 above. Step 6 can be run to execute trades to fill these orders and empty the listings.
