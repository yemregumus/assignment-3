/*
This module can be used to reset the database
node ./resetmongodb.js 
and its all like its in the beginning.
*/


const MongoClient = require("mongodb").MongoClient;								//	require MongoDB and create MongoClient object
const uri = "mongodb+srv://ygumus:13uncucumA@senecaweb.xujfi4i.mongodb.net/?retryWrites=true&w=majority";

async function insertUsers() {

    let dbUsers, result, docUsers;

    try {
        const client = await MongoClient.connect(uri);
        dbUsers = client.db('Library');
    } catch (err) {
        console.log(`err = ${err}`);
    }

    try {
        result = await dbUsers.collection("users").deleteMany({});
        console.log(`Number of user documents deleted from collection: ${result.deletedCount}`);
    } catch (err) {
        console.log(`err = ${err}`);
    }

    docUsers = [
        { username : "george.tsang@senecacollege.ca",   IDBooksBorrowed: ["44444", "50000", "83098"]},
        { username : "john@beatles.uk",                 IDBooksBorrowed: []},
        { username : "paul@beatles.uk",                 IDBooksBorrowed: []},
        { username : "george@beatles.uk",               IDBooksBorrowed: []},
        { username : "ringo@beatles.uk",                IDBooksBorrowed: ["11345"]},
        { username : "mick@rollingstones.uk",           IDBooksBorrowed: ["90044"]}
    ];

    try {
        result = await dbUsers.collection("users").insertMany(docUsers);
        console.log(`Number of user documents inserted to collection: ${result.insertedCount}`);
    } catch (err) {
        console.log(`err = ${err}`);
    }
 
}

async function insertBooks() {
    let dbBooks, result, docBooks;

    try {
        const client = await MongoClient.connect(uri);
        dbBooks = client.db('Library');
    } catch (err) {
        console.log(`err = ${err}`);
    }

    try {
        result = await dbBooks.collection("books").deleteMany({});
        console.log(`Number of book documents deleted from collection: ${result.deletedCount}`);     
    } catch (err) {
        console.log(`err = ${err}`);
    }

    docBooks = [
        { ID: "11345", title: "The Shining",                author: "Stephen King",            available : false},
        { ID: "12406", title: "Rainbow Six",                author: "Tom Clancy",              available : true },
        { ID: "29937", title: "Steve Jobs",                 author: "Walter Isaacson",         available : true },
        { ID: "44444", title: "Elon Musk",                  author: "Ashley Vance",            available : false},
        { ID: "48912", title: "Pride and Prejudice",        author: "Jane Austen",             available : true },
        { ID: "50000", title: "Killing Floor",              author: "Lee Child",               available : false},
        { ID: "55755", title: "Rules of Prey",              author: "Rules of Prey",           available : true },
        { ID: "68529", title: "The C Programming Language", author: "Kernighan and Ritchie",   available : true },
        { ID: "76008", title: "On a Pale Horse",            author: "Piers Anthony",           available : true },
        { ID: "79112", title: "Mortal Stakes",              author: "Robert B. Parker",        available : true },
        { ID: "83098", title: "The Firm",                   author: "John Grisham",            available : false},
        { ID: "86868", title: "Exit Lines",                 author: "Reginald Hill",           available : true },
        { ID: "90044", title: "Point of Impact",            author: "Stephen Hunter",          available : false},
        { ID: "93571", title: "Pronto",                     author: "Elmore Leonard",          available : true },
        { ID: "99992", title: "A Deadly Shade of Gold",     author: "John D. MacDonald",       available : true }
        
    ];

    try {
        result = await dbBooks.collection("books").insertMany(docBooks);
        console.log(`Number of book documents inserted to collection: ${result.insertedCount}`);
    } catch (err) {
        console.log(`err = ${err}`);
    }
}

insertBooks();
insertUsers();
