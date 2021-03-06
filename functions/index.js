const functions = require("firebase-functions");
const admin = require("firebase-admin")
const express = require('express');

admin.initializeApp();
const app = express();

app.get('/screams', (req, res)=>{
    admin.firestore().collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
        .then(data =>{
            let screams = []
            data.forEach(doc =>{
                screams.push({
                    screamId: doc.id,
                    ...doc.data()})
            });
            return res.json(screams)
        })
        .catch(err => console.error(err))
});
app.post('/scream',(req, res) =>{
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };
    admin.firestore()
        .collection('screams')
        .add(newScream)
        .then(doc => {
            res.json({message: `document ${doc.id} created successfully`})
        })
        .catch(err =>{
            res.status(500).json({error: 'Something went worng'})
            console.error(err)
        })
})

exports.api = functions.https.onRequest(app)