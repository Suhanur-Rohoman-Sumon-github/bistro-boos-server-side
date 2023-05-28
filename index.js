const express = require('express')
const cors = require('cors')
const ports = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()

app.use(cors())
app.use(express.json())



const uri = "mongodb+srv://bistro-boos:0JDqiq2xWmm5F2hl@cluster0.eepi0pq.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const menu = client.db('bistro-boos').collection('menue-data')
        const testimonials = client.db('bistro-boos').collection('testimonial')
        app.get('/menu',async(req,res)=>{
            const quire = menu.find()
            const result = await quire.toArray()
            res.send(result)
        })
        app.get('/testimonial',async(req,res)=>{
            const quire = testimonials.find()
            const result = await quire.toArray()
            res.send(result)
        })
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
       
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('vai tumar side coltese prea nai')
})
app.listen(ports, () => {
    console.log(`bistro boos is runing in ${ports}`)
})