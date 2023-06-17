const express = require("express");
const router = express.Router();
const ctrlContact = require("../controller/contacts");
const ctrlUsers = require("../controller/users");
const auth = require("../middleware/auth");
const upload = require("../middleware/avatarUploader");

router.get("/contacts", auth, ctrlContact.get);

router.get("/contacts/:contactId", auth, ctrlContact.getById);

router.post("/contacts", auth, ctrlContact.create);

router.put("/contacts/:contactId", auth, ctrlContact.update);

router.patch("/contacts/:contactId/favorite", auth, ctrlContact.updateStatus);

router.delete("/contacts/:contactId", auth, ctrlContact.remove);

router.post("/users/signup", ctrlUsers.signup);

router.post("/users/login", ctrlUsers.login);

router.post("/users/logout", auth, ctrlUsers.logout);

router.get("/users/current", auth, ctrlUsers.getCurrent);

router.patch("/users/", auth, ctrlUsers.setSubscription);

router.patch(
  "/users/avatars",
  auth,
  upload.single("avatar"),
  ctrlUsers.setAvatar
);

module.exports = router;
