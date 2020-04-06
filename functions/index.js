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
    const newQuote = {
        quote: req.body.quote,
        by: req.body.by,
        source: req.body.source,
        year: req.body.year

    };
    (async () => {
    try
    {
        await db.collection('quotes').doc('/' + req.body.id + '/')
        .create(newQuote);
        return res.status(201).send(' New quote added' + res);
    }
    catch(error)
    {
        console.log(error)
        return res.status(400).send(error)
    }
   })();
});

//Fetch a specific record
    app.get('/api/read/:id', (req, res) => {
        (async() => {
            try
            {
                const document = db.collection('quotes').doc(req.params.id);
                const fetchedQuote = await document.get();
                const response = fetchedQuote.data();
                if (response) {
                    return res.status(200).send(response);
                }
                else {
                    return res.status(404).send("Document not found");
                    }
            }
            catch(error)
            {
                console.log(error);
                return res.status(400).send(error);
            }
        })();
    });

    //Fetch all records
    app.get('/api/read', (req,res) => {
        (async() => {
            try
            {
                const allQuotes = db.collection('quotes');
                const response = [];

                await allQuotes.get().then(eachQuote => {
                    let docs = eachQuote.docs;
                
                    for(let doc of docs){
                        const selectedQuote = {
                            id: doc.id,
                            quote: doc.data().quote,
                            by: doc.data().by,
                            source: doc.data().source,
                            year: doc.data().year
                        }
                        response.push(selectedQuote);
                    }
                    return response;
                })
                return res.status(200).send(response);

            }
            catch(error){
                console.log(error);
                return res.status(404).send(error);
            }
        })();
    })

//Update
    app.patch('/api/update/:id', (req,res) => {
        const updateQuote = {
            quote: req.body.quote,
            by: req.body.by,
            source: req.body.source,
            year: req.body.year

        };
        (async() => {
            try
            {
                const recordToUpdate = db.collection('quotes').doc(req.params.id);
                if (recordToUpdate)
                {
                        await recordToUpdate.update(updateQuote);
                        return res.status(200).send('Record succesfully updated');
                } else
                {
                    return res.status(404).send('Record Not Found')
                }
                
            }
            catch(error){
                console.log(error);
                return res.status(400).send(error);
            }
        })();
    });
//Delete
    app.delete('/api/delete/:id', (req, res) => {
        (async() => {
            try
            {
                const recordToDelete = db.collection('quotes').doc(req.params.id);
                if (recordToDelete) {
                    await recordToDelete.delete();
                    return res.status(200).send('Quote succesfully deleted')
                } else {
                    return res.status(404).send('Record not found');
                }
            }
            catch(error){
                console.log(error);
                return res.status(400).send(error);
            }

        })();
    })

exports.app = functions.https.onRequest(app);