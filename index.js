const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.mongoUser}:${process.env.mongoPass}@cluster0.ympa4ek.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const app = express()
const port =  process.env.PORT || 3000
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// ## middleware
app.use(cors())


async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    const database = client.db('findgear')
    const collProducts = database.collection('products')
    
    // ### routes
    app.get('/', (req, res) => {res.send('welcome!')})



    // ### Send a ping
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged deployment!");
  } catch (err) {
    console.log(err.message);
  }
}
run().catch(console.dir);

// ## run server
app.listen(port, () => {console.log('listening on http://localhost:'+port)})