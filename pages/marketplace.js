import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from "web3modal";

import { nftaddress, nftmarketaddress } from '../config';

import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"

export default function Home() {
  const [nfts, setNfts] = useState([]); // Array of NFTs
  const [loadingState, setLoadingState] = useState('not-loaded'); // State for if app is loaded

  // Load NFTs on app startup
  useEffect(() => {
    loadNFTs();
  }, [])

  const projectId = process.env.PROJECT_ID

  async function loadNFTs() {
    //const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/d8864f3ade1d418dac2d3cac718a25b0`); 
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, provider);
    const data = await marketContract.fetchMarketItems();
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId); // Token URI (just a string) is on the blockchain. It points to a location on internet (ifps) where JSON metadata can be found
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price, 
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item;
    }))
    setNfts(items);
    setLoadingState('loaded');
  }

  async function buyNft(nft) {
    const web3modal = new Web3Modal()
    const connection = await web3modal.connect()
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {value: price});
    await transaction.wait();
    loadNFTs();

  }



  // If we got the nfts and there are none, display that there are none
  if (loadingState === 'loaded' && !nfts.length) return (
    <h1 className='px-20 py-10 text-3xl'>No items in marketplace</h1>
  )

  return (
    

      <div className='flex justify-center'>
        <div className='px-4' style={{maxWidth: '1600px'}}>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
            {
              nfts.map((nft, i) => (
                <div key={i} className="border shadow rounded-xl overflow-hidden"> 
                  <img src={nft.image}/>
                  <div className='p-4'>
                    <p style={{height: '64px'}} className='text-2xl font-semibold'>{nft.name}</p>
                    <div style={{height: '70px', overflow: 'hidden'}}>
                      <p className='text-gray-400'>{nft.description}</p>
                    </div>
                  </div>
                  <div className='p-4 bg-black'>
                    <p className='text-2xl mb-4 font-bold text-white'>{nft.price} Matic</p>
                    <button className='w-full bg-pink-500 text-white font-bold py-2 px-12 rounded' onClick={() => buyNft(nft)}>Buy</button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
  
  )
}
