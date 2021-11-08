
// const uri =
//   "mongodb+srv://admin:GLuoPTN8eB3eA5Xc@326-final-alpha.juhom.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// DELETE LATER ^^^^^^

const { MongoClient } = require("mongodb");

// Replace the following with values for your environment.
const username = encodeURIComponent("admin");
const password = encodeURIComponent("GLuoPTN8eB3eA5Xc");
const clusterUrl = "326-final-alpha.juhom.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// Replace the following with your MongoDB deployment's connection string.
const uri =
`mongodb+srv://${username}:${password}@${clusterUrl}`;

// Create a new MongoClient
const client = new MongoClient(uri);

// Function to connect to the server
async function run() {
    try {
        // Connect the client to the server
        await client.connect();

        await createTest(client, {"user_id": "username", "pass": "password123"});
        // Establish and verify connection
        await client.db("admin").command({ ping: 1 });
        console.log("Connected successfully to server");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);

async function createTest(client, object) {
    const result = await client.db("watchalldata").collection("userdata").insertOne(object);
    console.log(result);
}
  
