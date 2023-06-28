const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");

const { tempDir } = require("./middleware/avatarUploader");
const uriDb = process.env.DB_HOST;

const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running. Use our API on port: 3000");
});

const isAccessible = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async (folder) => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder);
  }
};

connection
  .then(() => {
    console.log(`Database connection successful`);
    createFolderIsNotExist(tempDir);
    createFolderIsNotExist(path.join(process.cwd(), "public", "avatars"));
  })
  .catch((err) => {
    console.log(`Database connection failed. Error message: ${err.message}`);
    process.exit(1);
  });
