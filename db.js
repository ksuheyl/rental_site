import mongoose from "mongoose";

const conn = () => {
  mongoose
    .connect(process.env.DB_URI, {
      dbName: "retal_site",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("connected to the DB successful");
    })
    .catch((err) => {
      console.log(`DB connection err:, ${err}`);
    });
};

export default conn;
