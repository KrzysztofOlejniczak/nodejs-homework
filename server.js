const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const uriDb = process.env.DB_HOST;

const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000");
});

connection
  .then(() => {
    console.log(`Database connection successful`);
  })
  .catch((err) => {
    console.log(`Database connection failed. Error message: ${err.message}`);
    process.exit(1);
  });
