import { MongoClient } from 'mongodb';

//in here we will define server side code because api routes will only run on the server, never on the client
//url:- /api/new-meetup, if the request is sent to this url then it will trigger the functions in here
//POST /api/new-meetup

async function handler(req, res){  //we can get req body or header and res object could be sent
    if(req.method === 'POST'){
        const data = req.body;

       const client =  await MongoClient.connect('mongodb+srv://ripu3:ripsim690@cluster0.h0nsg.mongodb.net/meetups?retryWrites=true&w=majority'); //connect returns a promise
        //this is the code we never wanna run on the client side as we could expose our credentials
        const db = client.db();

        const meetupsCollection = db.collection('meetups');

        const result = await meetupsCollection.insertOne(data);  //it will add one new document/entry in the collection/table. it also returns a promise
        console.log(result);
        client.close();

        res.status(201).json({message: 'Meetup inserted!'});  //res is an object
        //201 means something was inserted successfully. json data will be added to the response
    }
} 

export default handler;