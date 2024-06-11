import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';


// ############# GENERATE CURRENT TIME AND DATE ############################################
  const getSaveTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
// #########################################################################################

// ############# CHECK WHICH DATE IS THE MOST RECENT #######################################
const isLaterThan = (dateTime1, dateTime2) => {
  const dt1 = new Date(dateTime1);
  const dt2 = new Date(dateTime2);

  return dt1 > dt2;
};
// #########################################################################################


// Configure dotenv to read .env file
dotenv.config();


const app = express();
const port = process.env.PORT || 3002 || 3000;


// Configure CORS to allow requests from http://webinno.se and Localhost
const corsOptions = {
  origin: ['http://localhost', 'http://127.0.0.1', 'http://webinno.se'],
};
app.use(cors(corsOptions));



// Use bodyParser to parse JSON request bodies
app.use(bodyParser.json());


// WHITEBOARD API
app.post('/whiteboard/api/posts', async (req, res) => {

 

  const title = req.body.title;
  const content = req.body.content;
  const wid = req.body.wid;
  const bkey = req.body.bkey;
  const currentTime = req.body.currentTime;
  const saveTime = getSaveTime();

  let item = {};
  item.title = title;
  item.content = content;
  item.wid = wid;
  item.bkey = bkey; 
  item.currentTime = currentTime;
  item.saveTime = saveTime;

  console.log("Title: ", title);
  console.log("Content: ", content);
  console.log("Wid: ", wid);
  console.log("Bkey: ", bkey);
  console.log("CurrentTime: ", currentTime);
  console.log("SaveTime: ", saveTime);

  const uri =
  "mongodb+srv://Cluster03639:" +
  process.env.DB_URL +
  "@cluster03639.cwscvkg.mongodb.net";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: false,
  },
});

//let wbPosts;

try {

  await client.connect();
  await client.db("whiteboard").command({ ping: 1 });
  console.log(
    "Pinged your deployment. You successfully connected to MongoDB!"
  );

  const database = client.db("whiteboard");
  const collection = database.collection("wbposts");

  //console.log("DB-latest item-bkey: ", item.bkey);

  // SECTION TO MERGE TWO DIFFERENT POSTS WHEN TAKING PLACE WITHIN THE SAME TIME WINDOW
//     const latestPost = await collection.find({ bkey: item.bkey }).sort({ _id: -1 }).limit(1).toArray();

//     console.log("DB-latest: ", latestPost);
  
//     //console.log("CurrTimeIsLaterThan: ", currentTime);
//    // console.log("CurrTime latestPost: ", latestPost[0].currentTime);
  
//     if(latestPost) {
//         if((isLaterThan(latestPost[0].currentTime, currentTime)) && (latestPost[0].bkey===item.bkey)) {
//             item.content = latestPost[0].content + " \n\n " + item.content;
//         }
//     }

  await collection.insertOne(item);
  

} catch (error) {
  console.error("MongoDB error: ", error);
} finally {
  await client.close();
}


 res.status(200).json(item);

});


// WHITEBOARD API
app.post('/whiteboard/api/sync', async (req, res) => {

  console.log("Connected to Sync Down:");

  const bkey = req.body.bkey;

  const uri =
  "mongodb+srv://Cluster03639:" +
  process.env.DB_URL +
  "@cluster03639.cwscvkg.mongodb.net";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: false,
  },
});

let latestPost;

try {

  await client.connect();
  await client.db("whiteboard").command({ ping: 1 });
  console.log(
    "Pinged your deployment. You successfully connected to MongoDB!"
  );

  const database = client.db("whiteboard");
  const collection = database.collection("wbposts");

  console.log("sync bkey:", bkey);
  latestPost = await collection.find({ "bkey": bkey }).sort({ _id: -1 }).limit(1).toArray();
  console.log("latest post: ", latestPost);

} catch (error) {
  console.error("MongoDB error: ", error);
} finally {
  await client.close();
}

 res.status(200).json(latestPost);

});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});