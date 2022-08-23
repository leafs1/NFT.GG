require("@nomiclabs/hardhat-waffle");

require('dotenv').config(); // dotenv package loads vars in .env during runtime

const privateKey = process.env.PRIVATE_KEY; // Private key for metamask acc stored in .env
//const projectId = process.env.PROJECT_ID


module.exports = {
  // Set RPC nodes to what we are going to connect to
  networks: {
    // Dont need to define an account cause hardhat test env automatically does it for us.
    hardhat: {
      chainId: 1337 // Hardhat config thing
    },

    /*mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/{put project id here}`,
      //Accounts from which we are deploying our contracts
      accounts: [privateKey]

    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/{put project id here}`,
      accounts: [privateKey]
    }*/
  },

  solidity: "0.8.4",
};
