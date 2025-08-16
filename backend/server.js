import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postsRoutes from "./routes/posts.routes.js";
import UserRoutes from "./routes/user.routes.js";

if (process.env.NODE_ENV != "production") {
   dotenv.config();
  }
  const dbUrl=process.env.ATLASDB_URL;
  
  const app = express();
  const port = 9090;
 

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  app.use(postsRoutes);
  app.use(UserRoutes);
  app.use(express.static("uploads"));
  //db connection
  main()
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}
app.listen(9090,()=>{
    console.log(`server is running on port ${port}`);
});

