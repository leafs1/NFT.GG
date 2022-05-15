import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from "web3modal";
import 'bootstrap/dist/css/bootstrap.min.css';

import { nftaddress, nftmarketaddress } from '../config';

//import { Tabs, Tab, Container, Row } from 'react-bootstrap'

import PacksTabs from './components/PacksTabs'

import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"

export default function Home() {
  

  return (
    <PacksTabs headings={["OVERVIEW", "IN STOCK", "SOLD OUT"]}></PacksTabs>
    
    
  )
}
