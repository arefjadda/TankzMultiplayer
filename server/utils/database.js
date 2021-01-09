const { MongoClient } = require('mongodb');

// Initialize database
const uri = 'mongodb://localhost:27017';

class Database {
    constructor(uri) {
        MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then((res) => {
            this.db = res.db('tankz');
            this.db.collection("users").createIndex({ username: 1 }, { unique: true });
            console.log("connected to database.");
        }).catch((error) => {
            console.log(error);
        })

    }

    insertUser(username) {
        this.db.collection("users").insertOne({
            username: username,
            wins: 0
        });
    }
}

const database = new Database(uri);

module.exports = database;

// const docs = [
//     { username: "Red", wins: 1 },
//     { username: "Blue", wins: 4 },
//     { username: "Leon", wins: 6 }
//   ];
// const result = await collection.insertMany(docs, { ordered: true });
// console.log(`${result.insertedCount} documents were inserted`);