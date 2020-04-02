const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quotesapp-3714d.firebaseio.com"
});

const express = require('express');
const app = express();
const db = admin.firestore();

const cors = require('cors');
app.use(cors({origin: "true" }));


//Routes

//Root
app.get('/', (req, res) => {
    return res.status(200).send("Hello World!");
});

//Create
app.post('/api/create', (req, res) => {
    let newQuote = {
        quote: req.body.quote,
        by: req.body.by,
        source: req.body.source,
        year: req.body.year

    };
    (async () => {
    try
    {
        await db.collection('quotes').doc('/' + req.body.id + '/')
        .create(newQuote)
        return res.status(201).send(' New quote added' + res)
    }
    catch(error)
    {
        console.log(error)
        return res.status(400).send(error)
    }
   })();
});
//Update
//Read
//Delete

exports.app = functions.https.onRequest(app);