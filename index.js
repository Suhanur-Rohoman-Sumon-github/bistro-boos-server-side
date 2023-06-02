const express = require('express')
const cors = require('cors')
const ports = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const menu = client.db('bistro-boos').collection('menu-data')
        const testimonials = client.db('bistro-boos').collection('testimonial')
        const myCart = client.db('bistro-boos').collection('carts')
        const myUser = client.db('bistro-boos').collection('users')

        // user cullection start here
        // get all user information in there
        app.get('/users', async (req, res) => {
            const result = await myUser.find().toArray()
            res.send(result)
        })
        // get specific user data
        app.get('/users/:id',async(req,res)=>{
            const id = req.params.id
            const filter ={ _id: new ObjectId(id)}
            const result = await myUser.findOne(filter)
            res.send(result)
        })
        // user added to the database
        app.post('/users', async (req, res) => {
            const user = req.body
            const query = { emails: user.email }
            console.log(query)
            const existinguser = await myUser.findOne(query)
            console.log('existinguser', existinguser)
            if (!existinguser) {
                return res.send({ massage: 'vai already added' })
            }

            const result = await myUser.insertOne(user)
            res.send(result)

        })
        // update user to admin
        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    rule: 'admin'
                }
            };

            try {
                const result = await myUser.updateOne(filter, updatedDoc);
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
        });
        app.delete('/users/:id',async(req,res) =>{
            const id = req.params.id
            const filter = {_id:new ObjectId(id)}
            const result = await myUser.deleteOne(filter)
            res.send(result)
        })

        //get specific carts data 

        app.get('/carts/:id', async (req, res) => {
            const id = req.params.id
            const quire = { _id: new ObjectId(id) }
            const result = await myCart.findOne(quire)
            res.send(result)
        })
        // get specific user data form card with quirey
        app.get('/carts', async (req, res) => {
            const email = req.query.email
            if (!email) {
                res.send([])
            }
            else {
                const query = { email: email }
                const result = await myCart.find(query).toArray()
                res.send(result)
            }

        })
        //  post carts data 
        app.post('/carts', async (req, res) => {
            const data = req.body
            const result = await myCart.insertOne(data)
            res.send(result)
        })
        // delete cart data
        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await myCart.deleteOne(query)
            res.send(result)
        })

        // my shop and tab data here
        app.get('/menu', async (req, res) => {
            const quire = menu.find()
            const result = await quire.toArray()
            res.send(result)
        })
        app.get('/testimonial', async (req, res) => {
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