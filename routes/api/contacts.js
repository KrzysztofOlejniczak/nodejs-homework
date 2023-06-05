const express = require("express");
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

const postContactSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(5).required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email(),
  phone: Joi.string().min(5),
}).or("name", "email", "phone");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      res.status(404).json({ message: "Not found" });
    } else {
      res.status(200).json(contact);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = postContactSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      const newContact = await addContact(req.body);
      res.status(201).json(newContact);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const removed = await removeContact(contactId);

    if (removed) {
      res.status(200).json({ message: "contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      const { contactId } = req.params;
      const body = req.body;
      const updated = await updateContact(contactId, body);

      if (updated) {
        res.status(200).json(updated);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
