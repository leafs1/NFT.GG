import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import 'bootstrap/dist/css/bootstrap.min.css';

import { nftaddress, nftmarketaddress } from '../config';

import { Row, Col } from 'react-bootstrap';

import PacksTabs from './components/PacksTabs';
import PacksCard from './components/PacksCard';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

export default function Home() {
  return (
    <div className='bg-black'>

      <PacksTabs headings={['OVERVIEW', 'IN STOCK', 'SOLD OUT']}></PacksTabs>

      <Row xs={1} md={2} className="g-4 p-60 pt-28" >
        {Array.from({ length: 4 }).map((_, idx) => (
          <Col>
            <PacksCard img="/metamask.jpg" title="test" text="some text" ></PacksCard>

          </Col>
        ))}
      </Row>
    </div>

  );
}
