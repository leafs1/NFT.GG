// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds; // Counter for each market item created
    Counters.Counter private _itemsSold; // Counter for number of items sold cause we cant have dynamic linked arrays in solidity

    address payable owner; // owner of the contract
    uint256 listingPrice = 0.025 ether; // the ether keyword adds 18 decmial points. This is equivalent to matic


    constructor() {
        owner = payable(msg.sender); // Person who called the contract is the owner
    }

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem; // Dict with all market items (uint256 is the itemId and its the local itemId that we store not tokenId)

    event MarketItemCreated ( 
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    function getListingPrice() public view returns(uint256) {
        return listingPrice;
    }

    // List an item on the marketplace
    function createMarketItem(address nftContract, uint256 tokenId, uint256 price) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei"); // Like assert
        require(msg.value == listingPrice, "Price must be equal to listing price");

        _itemIds.increment(); // Increment total number of nfts on market place
        uint256 itemId = _itemIds.current(); // ID for market place item that we are putting for sale

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender), // seller is person who called the fucntion 
            payable(address(0)), // "No one ownes it" cause its for sale still. However, the contract takes ownership over the nft here. TODO Can make functions for cancelling this
            price,
            false
        );

        // Transfer ownership of nft from original owner to smart contract
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        // Send out data to webserver that a new nft has been listed 
        emit MarketItemCreated(itemId, nftContract, tokenId, msg.sender, address(0), price, false);

    }


    // Sell an item on marketplace (transfer ownership to new owner)
    function createMarketSale(address nftContract, uint256 itemId) public payable nonReentrant {
        uint price = idToMarketItem[itemId].price; 
        uint tokenId = idToMarketItem[itemId].tokenId;

        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        idToMarketItem[itemId].seller.transfer(msg.value); // transfer money sent in transaction to the seller
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId); // Transfer ownership of token to msg sender (i.e. buyer)
        idToMarketItem[itemId].owner = payable(msg.sender); // Set the new owner of the nft to be the buyer locally
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment(); // Increment items sold
        payable(owner).transfer(listingPrice); // Transfer commission back to initial creator of the NFT

    }

    // Returns array of unsold items on the marketplace
    function fetchMarketItems() public view returns(MarketItem[] memory) {
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();


        uint currentIndex = 0; // Store current index of the items array 
        MarketItem[] memory items = new MarketItem[](unsoldItemCount); // Make an array the size of the number of items in the market and store in memory
        for (uint i = 0; i < itemCount; i++) { // Loop over total number of items that have been created
            if (idToMarketItem[i+1].owner == address(0)) { // If the market item has no owner that means it is on the marketplace and unsold
                uint currentId = idToMarketItem[i+1].itemId; // local ID of the unsold item
                MarketItem storage currentItem = idToMarketItem[currentId]; // MarketItem object of the item
                items[currentIndex] = currentItem; // Insert unsold item into array
                currentIndex ++;
            }
        }

        return items;
    }

    // Returns array of NFTs that the user has purchased
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        
        uint itemCount = 0; // Number of nfts that the user calling the function owns
        uint currentIndex = 0; // store current index of the items array which stores a list of our nfts

        // Loop through all market items and find the number of nfts the user owns
        for (uint i=0; i<totalItemCount; i++) { 
            if (idToMarketItem[i+1].owner == msg.sender) {
                itemCount ++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount); // Array storing a list of our nfts

        // Loop through all market items and add out nfts to the list, 'items'
        for (uint i=0; i < totalItemCount; i++) {
            if (idToMarketItem[i+1].owner == msg.sender) {
                uint currentId = idToMarketItem[i+1].itemId; // I'm pretty sure this line is useless, not exactly sure though
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem; // Add our nft to the list
                currentIndex ++;
            }
        }

        return items;
    }

    // returns array of nfts that user added to the marketplace (could also be list of nfts that the current user is selling)
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        
        uint itemCount = 0; //
        uint currentIndex = 0; // 

        // Loop through all market items and find the number of nfts that the user created.
        for (uint i=0; i<totalItemCount; i++) { 
            if (idToMarketItem[i+1].seller == msg.sender) {
                itemCount ++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount); // Array storing a list of our created nfts

        // Loop through all market items and add our created nfts to the list, 'items'
        for (uint i=0; i < totalItemCount; i++) {
            if (idToMarketItem[i+1].seller == msg.sender) {
                uint currentId = idToMarketItem[i+1].itemId; // I'm pretty sure this line is useless, not exactly sure though
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem; // Add our nft to the list
                currentIndex ++;
            }
        }

        return items;


    }



}