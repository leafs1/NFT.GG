import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Tabs, Tab, Container, Row } from 'react-bootstrap';

export default function PacksTabs(props) {
  return (
    <div className='bg-black' >
      <Container >
        <h1 className='packsTitle '>PACKS</h1>

        <Tabs defaultActiveKey="OVERVIEW" variant="pills" className='packsTab'>
          {
            props.headings.map((tab) => {
              return <Tab eventKey={tab} title={tab} ></Tab>;
            })
          }
        </Tabs>
      </Container>

    </div>

  );
}
