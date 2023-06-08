const service = require("../service");
const Joi = require("joi");

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

const updateStatusSchema = Joi.object({
  favorite: Joi.bool().required(),
});

const get = async (req, res, next) => {
  try {
    const results = await service.getAllContacts();
    res.status(200).json(results);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await service.getContactById(contactId);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({
        message: `Not found task id: ${contactId}`,
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const create = async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    const { error } = postContactSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      const result = await service.createContact({ name, email, phone });
      res.status(201).json(result);
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const update = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      const result = await service.updateContact(contactId, {
        name,
        email,
        phone,
      });
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({
          message: `Not found task id: ${contactId}`,
        });
      }
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateStatus = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite = false } = req.body;

  try {
    const { error } = updateStatusSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: "missing field favorite" });
    } else {
      const result = await service.updateContact(contactId, { favorite });
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({
          message: `Not found task id: ${contactId}`,
        });
      }
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const remove = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const result = await service.removeContact(contactId);
    if (result) {
      res.status(200).json({ message: "contact deleted" });
    } else {
      res.status(404).json({
        message: `Not found task id: ${contactId}`,
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  updateStatus,
  remove,
};
