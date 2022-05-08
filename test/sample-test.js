const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("NFTMarket"); // I think this func
    const market = await Market.deploy();
    await market.deployed()
    const marketAddress = market.address; // reference to addres from which the market was deployed

    const NFT = await ethers.getContractFactory("NFT"); 
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed();
    const nftContractAddress = nft.address; // reference to nft contract itself

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits('100', 'ether');

    // Create tokens to put them up for sale
    await nft.createToken("https://www.mytokenlocation.com");
    await nft.createToken("https://www.mytokenlocation2.com");

    await market.createMarketItem(nftContractAddress, 1, auctionPrice, {value: listingPrice}) // the {value: listingPrice} is going to be whats in the "msg" thing
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, {value: listingPrice})

    const [_, buyerAddress] = await ethers.getSigners(); //destructure the arr, seller is "_" and other one is buyer

    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {value: auctionPrice}); // Execute purchase, where buyerAddress is buying the nft

    let items = await market.fetchMarketItems(); // Get unsold items on marketplace
    
    items = await Promise.all(items.map(async i => { // We are mapping through the array asynchronously here
      const tokenUri = await nft.tokenURI(i.tokenId);
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller.toString(),
        owner: i.owner.toString(),
        tokenUri
      }
      return item
    }))
    
    
    console.log('items: ', items);

  });
});
