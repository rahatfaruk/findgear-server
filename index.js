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

    // get: all products with query
    app.get('/products', async (req, res) => {
      const query = req.query
      let newQuery = {}     
      const currPage = +query.currPage
      const limit = +query.limit || 10
      const skip = (currPage - 1) * limit

      const queryOptions = {
        skip,
        limit
      }
      
      // search query
      newQuery.name = { $regex: new RegExp(query.search, 'i') }
      // sort      
      switch (query.sort) {
        case 'date':
          queryOptions.sort = { created_at: 1 }
          break;
        case 'price-asc':
          queryOptions.sort = { price: 1 }
          break;
        case 'price-desc':
          queryOptions.sort = { price: -1 }
          break;
      
        default:
          queryOptions.sort = {}
          break;
      }
      // filter - category
      if (query.category) {
        newQuery.category = query.category
      }
      // filter - multiple brand
      if (query.brands) {
        // brands -> "apple samsung" 
        newQuery.brand = { $in: query.brands.split(' ') }
      }
      // filter - price range
      if (+query.priceMax) {
        newQuery.price = { $gte: +query.priceMin, $lte: +query.priceMax }
      }

      
      // get products data; count products
      const productsData = await collProducts.find(newQuery, queryOptions).toArray()
      const totalProducts = await collProducts.countDocuments(newQuery)
      
      return res.send({products: productsData, total: totalProducts})
    })


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