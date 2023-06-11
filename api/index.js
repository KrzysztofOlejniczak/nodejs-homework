const express = require("express");
const router = express.Router();
const ctrlContact = require("../controller");

router.get("/contacts", ctrlContact.get);

router.get("/contacts/:contactId", ctrlContact.getById);

router.post("/contacts", ctrlContact.create);

router.put("/contacts/:contactId", ctrlContact.update);

router.patch("/contacts/:contactId/favorite", ctrlContact.updateStatus);

router.delete("/contacts/:contactId", ctrlContact.remove);

module.exports = router;
