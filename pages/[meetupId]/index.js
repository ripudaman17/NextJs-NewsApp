import MeetupDetail from "../../components/meetups/MeetupDetail";
import {MongoClient, ObjectId} from 'mongodb';
import Head from "next/head";

function MeetupDetails(props) {
  return (
    <>
    <Head>
        <title>{props.meetupData.title}</title>
        <meta name='description' content={props.meetupData.description}/>
    </Head>
      <MeetupDetail
      image={props.meetupData.image}
      title={props.meetupData.title}
      address={props.meetupData.address}
      description={props.meetupData.description}
    />
    </>
  );
}

export async function getStaticPaths() {

  const client =  await MongoClient.connect('mongodb+srv://ripu3:ripsim690@cluster0.h0nsg.mongodb.net/meetups?retryWrites=true&w=majority');
  const db = client.db();
  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, {_id: 1}).toArray(); //2nd argument determines which fields should be extracted for every document
  //this means only include the id and no other field values 

  client.close();

  return {
    fallback: false,     //this key fallback, tells next js whether your paths array contains all supported parameter values or just some of them
    // if you set it to false, you say your paths contains all supported meetupID values and if there is any other ID other than in the paths array, it will generate 404 error
    // if you set it to true, next js will try to generate a page for this meetupID dynamically on the server for the incoming request
    paths: meetups.map(meetup => ({
      params: {meetupId: meetup._id.toString()}
    }))  //paths should be an array of objects
    
    
    // [
    //   {
    //     params: {
    //       meetupId: "m1",
    //     },
    //   },
    //   {
    //     params: {
    //       meetupId: "m2",
    //     },
    //   },
    // ],
  };
}
//we can define some paths instead of all paths. for eg if we have 100s of pages and we dont wanna pre-generate all of them, but only few of them

export async function getStaticProps(context) {
  //fetch data for single meetup

  //we are getting an id out from the url 
  const meetupId = context.params.meetupId; //this will be an obj where our identifiers between the square brackets will be properties
  
  const client =  await MongoClient.connect('mongodb+srv://ripu3:ripsim690@cluster0.h0nsg.mongodb.net/meetups?retryWrites=true&w=majority');
  const db = client.db();
  const meetupsCollection = db.collection('meetups');

  const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)}); //it finds one single document

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description
      },
       
    },
  };
}

export default MeetupDetails;
