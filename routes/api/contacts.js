const express = require("express");

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    res.status(404).json({ message: "Not found" });
  } else {
    res.status(200).json(contact);
  }
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name) {
    res.status(400).json({ message: "missing required name - field" });
  } else if (!email) {
    res.status(400).json({ message: "missing required email - field" });
  } else if (!phone) {
    res.status(400).json({ message: "missing required phone - field" });
  } else {
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const removed = await removeContact(contactId);

  if (removed) {
    res.status(200).json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
