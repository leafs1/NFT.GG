require("@nomiclabs/hardhat-waffle");

require('dotenv').config(); // dotenv package loads vars in .env during runtime

const privateKey = process.env.PRIVATE_KEY; // Private key for acc stored in .env

module.exports = {
  // Set RPC nodes to what we are going to connect to 
  networks: {
    // Dont need to define an account cause hardhat test env automatically does it for us.
    hardhat: {
      chainId: 1337 // Hardhat config thing
    },
    mumbai: {
      url: "https://rpc-mumbai.matic.today",
      //Accounts from which we are deploying our contracts
      accounts: [privateKey]
      
    },
    mainnet: {
      url: "https://polygon-rpc.com/",
      accounts: [privateKey]
    }
  },

  solidity: "0.8.4",
};
