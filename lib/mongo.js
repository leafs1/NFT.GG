const { MongoClient } = require('mongodb');
//require('dotenv').config(); // dotenv package loads vars in .env during runtime

async function main() {
    
    const client = new MongoClient(process.env.MONGO_URI);

    try {
        await client.connect();
        
        //await exports.addNFT(client, {name: "first"})
        //await addNFT(client, {name: "first"})

        //await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {minimumNumberOfBedrooms: 4, minimumNumberOfBathrooms:2, maximumNumberOfResults: 5})

        //await findOneListingByName(client, "a");

        //await createMultipleListings(client, [{name: "a"}, {name: "b"}])

        /*await createListing(client, {
            name: "Lovely Loft",
            summary: "A charming loft in Paris",
            bedrooms: 1,
            bathrooms: 1
        })*/
    } catch (e) {
        console.error(e)
    } finally {
        await client.close()
    }


}



async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {minimumNumberOfBedrooms=0, minimumNumberOfBathrooms=0, maximumNumberOfResults=Number.MAX_SAFE_INTEGER} = {}) {
    const cursor = await client.db("sample_airbnb").collection("listingsAndReviews").find({
        bedrooms: {$gte: minimumNumberOfBedrooms},
        bathrooms: {$gte: minimumNumberOfBathrooms},
    }).sort({last_review: -1})
        .limit(maximumNumberOfResults);

    const results = await cursor.toArray();
    
    results.forEach((result, i) => {
        console.log(result._id)
    })

}

async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name: nameOfListing});

    if (result) {
        console.log(`found ${nameOfListing}`)
    } else {
        console.log(`not found`);
    }
}


export async function addMultipleNFTs(client, newNFTs) {
    const result = await client.db("nftgg_testing").collection("nfts").insertMany(newNFTs);

    console.log(`${result.insertedCount} new nfts created wiuth the following ids`)
    console.log(result.insertedIds)
}


export async function addNFT(client, newEntry) {
    

    const result = await client.db("nftgg_testing").collection("nfts").insertOne(newEntry)

    console.log(`New nftAdded with the following id: ${result.insertedId}`);
    client.close()
}





async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();
    
    console.log("Databases")
    databasesList.databases.forEach(db => {
        console.log(`-${db.name}`);
    })
}
