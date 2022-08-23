import { addNFT } from '../../lib/mongo.js';
const { MongoClient } = require('mongodb');

export default async(req, res) => {
  try {
    console.log('req nom', req.body);
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const result = await addNFT(client, req.body);
    console.log('ttt', result);
  } catch (error) {
    console.log(error);
  }
};
