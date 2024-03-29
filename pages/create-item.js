import { useState } from 'react';
import { ethers } from 'ethers';
import { create, CID } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';

import {
  nftaddress, nftmarketaddress
} from '../config';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

import axios from 'axios';

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [image, setImage] = useState({ cid: CID, path: null });

  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' });
  const router = useRouter();

  const projectId = '2Dgo3PNVTRBFI3D742hac4H9Bdj';
  const projectSecret = '754dab13f8a30c480b35f87a7e9da489';
  const authorization = 'Basic ' + btoa(projectId + ':' + projectSecret);
  try {
    const ipfs = create({
      url: 'https://ipfs.infura.io:5001/api/v0',
      headers: {
        authorization
      }
    });
  } catch (error) {
    console.error('IPFS error ', error);
    const ipfs = undefined;
  }

  async function onChange(event) {
    event.preventDefault();
    const file = event.target.files[0];

    if (!file) {
      return alert('No files selected');
    }
    const result = await ipfs.add(file);

    console.log(file, '----');
    console.log(result);

    setImage(
      {
        cid: result.cid,
        path: result.path
      }
    );

    /*
      // const file = e.target.files[0]
      try {
        const added = await client.add(
          file,
          {
            progress: (prog) => console.log(`received: ${prog}`)
          }
        )
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        setFileUrl(url)
      } catch (error) {
        console.log('Error uploading file: ', error)
      } */
  }
  async function createMarket() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !image) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image
    });
    try {
      const added = await ipfs.add(data);
      const url = 'https://nftgg.infura-ipfs.io/ipfs/' + added.path;
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url, name, description, image);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function createSale(url, name, description, image) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    const tx = await transaction.wait();
    const event = tx.events[0];
    const value = event.args[2];
    const tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(formInput.price, 'ether');

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice });
    await transaction.wait();

    const data = { name, description, image, nftaddress, tokenId, price, value: listingPrice };
    axios.post('/api/addNFT', data).then((response) => {
      console.log(response);
    });
    /*
      // Add new nft to mongodb
      const client = new MongoClient(process.env.MONGO_URI);
      addNFT(client, {nftaddress, tokenId, price, value: listingPrice})
      client.close()
*/
    router.push('/');
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          image.path && (
            <img className="rounded mt-4" width="350" key={image.cid.toString()} src={'https://nftgg.infura-ipfs.io/ipfs/' + image.path} />
          )
        }
        <button onClick={createMarket} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
            Create Digital Asset
        </button>
      </div>
    </div>
  );
}
