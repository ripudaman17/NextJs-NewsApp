import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from 'next/head'; 

// const DUMMY_MEETUPS = [
//   {
//     id: "m1",
//     title: "A First Meetup",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1024px-Stadtbild_M%C3%BCnchen.jpg",
//     address: "Some Address 5, 12345, Some City",
//     description: "This is a first meetup!",
//   },
//   {
//     id: "m2",
//     title: "A Second Meetup",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1024px-Stadtbild_M%C3%BCnchen.jpg",
//     address: "Some Address 10, 45, Some City",
//     description: "This is a second meetup!",
//   },
// ];

function HomePage(props) {

   
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta name='description' content='Browse a huge list of highly active React meetups!'/>
      </Head>
      <MeetupList meetups={props.meetups} />
      </>
  );
}

// export async function getServerSideProps(context){ //this function will not run during the build process but always on the server after deployment
//     //fetch data from an API 
//     //any code that you write here always run on the server

//     const req = context.req;
//     const res = context.res;
//   return {
//       props: {
//         meetups: DUMMY_MEETUPS
//       }
//     };
// }

export async function getStaticProps(){ //this will only execute in the pages component
  //the code that we write here is not going to be executed in the client side or end up in the client side.

  //fetch data from an API
  //this code will execute when this page is pre-generated
  const client =  await MongoClient.connect('mongodb+srv://ripu3:ripsim690@cluster0.h0nsg.mongodb.net/meetups?retryWrites=true&w=majority');
  const db = client.db();
  const meetupsCollection = db.collection('meetups');
   
  const meetups = await meetupsCollection.find().toArray();//so that we get back an array of documents

  client.close();

  return{
    props: {
      meetups: meetups.map(meetup => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString()  //it will convert this object to a string
      }))
    },
    //when we add this property we unlock a feature called incremental static generation
    revalidate: 10           //it will revalidate the server in every 10 seconds, this ensures that your data is not older than 10 sec              
  };
  
}

export default HomePage;
