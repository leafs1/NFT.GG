// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Import openzeppelin (ERC721 standard)
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Inherit from ERC721URIStorage which inherits from ERC721
contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter; // We can use the methods of "Counters" in types "Counters.Counter"
    Counters.Counter private _tokenIds; // _tokenIds will keep UUID for each NFT minted by being incremented at each mint
    address contractAddress; // Address of marketplace we want nft to interact with

    constructor(address marketplaceAddress) ERC721("Metaverse Tokens", "METT") {
        contractAddress = marketplaceAddress;
    }

    // Function for minting new tokens
    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current(); // Get current number of NFTs minted

        _mint(msg.sender, newItemId); // Mint NFT
        _setTokenURI(newItemId, tokenURI);// Set TokenURI to newItemId (I think not 100%)
        setApprovalForAll(contractAddress, true); // Give the marketplace permission to transfer tokens
        return newItemId;
    }   
}
