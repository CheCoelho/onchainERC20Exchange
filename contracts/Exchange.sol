//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


/**
 * @title Storage
 * @dev An on-chain exchange service capable of fascilitating the bidirectional exchange of Ether for ERC20 tokens. 
 */


contract Exchange {
    uint public tokenCount = 0;
    uint public totalOrders = 0;
    uint public totalListings = 0;

    mapping(uint=>address) registeredTokens;
    mapping(uint=>Order) Orders;
    mapping(uint=>Listing) Listings;

    struct Order {
        uint id;
        IERC20 token;
        address agent;
        uint fulfilled;
        uint amount;
        uint funding;
        bool closed;
    }

    struct Listing {
        uint id;
        IERC20 token;
        address payable agent;
        uint allowance;
        uint remaining;
        uint pricePerToken;
        bool emptied;
    }

    function registerToken(address _token) public {
        registeredTokens[tokenCount] = _token;
        tokenCount ++;
    }


    function getToken(uint _tokenId) public view returns (address) {
        return registeredTokens[_tokenId];
    }
    
    function getListing(uint _listingId) public view returns (Listing memory) {
        return Listings[_listingId];
    }

    function getOrder(uint _orderId) public view returns (Order memory) {
        return Orders[_orderId];
    }

    function listAsset(uint _tokenId, uint _allowance, uint _pricePerToken) public payable {
        uint _id = totalListings; 
        address _listingAgent = msg.sender;
        address _tokenAddress = registeredTokens[_tokenId];
        IERC20 token = IERC20(_tokenAddress);
  
        Listings[_id].id = _id;
        Listings[_id].token = token;
        Listings[_id].agent = payable(_listingAgent);
        Listings[_id].allowance = _allowance;
        Listings[_id].remaining = _allowance;
        Listings[_id].pricePerToken = _pricePerToken;
        Listings[_id].emptied = false;

        totalListings ++;
    }

    function placeOrder(uint _tokenId, uint _amount) external payable {
        uint _id = totalOrders; 
        address _agent = msg.sender;
        address _tokenAddress = registeredTokens[_tokenId];
        IERC20 orderedToken = IERC20(_tokenAddress);
                
        Orders[_id].id = _id;
        Orders[_id].token = orderedToken;
        Orders[_id].agent = _agent;
        Orders[_id].amount = _amount;
        Orders[_id].funding = msg.value;
        Orders[_id].fulfilled = 0;
        Orders[_id].closed = false;

        totalOrders ++;
    }

    function triggerOrderFullfillment (
        uint _orderId, 
        uint _listingId,
        uint _tokenAmount,
        address _tokenAddress
        ) public {
            fulfillOrder(_orderId, _listingId, _tokenAmount, _tokenAddress);
        }
        
    function fulfillOrder(
        uint _orderId, 
        uint _listingId,
        uint _tokenAmount,
        address _tokenAddress
        ) private  {
            Order memory order = Orders[_orderId];
            Listing memory listing = Listings[_listingId];
            IERC20 token = IERC20(_tokenAddress);
            address payable listingAgent = payable(listing.agent);
            address orderAgent = order.agent;
            uint price = order.funding;

            _updateOrder(_orderId, _tokenAmount);
            _updateListing(_listingId, _tokenAmount);
            listingAgent.transfer(price);
            _safeTransferFrom(token, listingAgent, orderAgent, _tokenAmount);
        }

    function _safeTransferFrom(
        IERC20 token,
        address sender,
        address recipient,
        uint amount
    ) private {
        bool sent = token.transferFrom(sender, recipient, amount);
        require(sent, "Token transfer failed");
    }

    function _updateOrder(uint _orderId, uint _amount) private {
        Orders[_orderId].fulfilled = _amount;
        if (Orders[_orderId].amount == Orders[_orderId].fulfilled) {
            Orders[_orderId].closed = true;
        }
    }
      function _updateListing(uint _listingId, uint _amount) private {
        Listings[_listingId].remaining -= _amount;
        if (Listings[_listingId].remaining == 0) {
            Listings[_listingId].emptied = true;
        }
    }
}