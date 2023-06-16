const Contact = require("./schemas/contacts");

const getAllContacts = async (owner, favorite) => {
  if (favorite && favorite.toLowerCase() === "true") {
    console.log("fav");
    return Contact.find({ owner, favorite: true });
  }

  if (favorite && favorite.toLowerCase() === "false") {
    console.log("fav");
    return Contact.find({ owner, favorite: false });
  }

  return Contact.find({ owner });
};

const getContactById = (id, owner) => {
  return Contact.findOne({ _id: id, owner });
};

const createContact = ({ name, email, phone, owner }) => {
  return Contact.create({ name, email, phone, owner });
};

const updateContact = (id, owner, fields) => {
  return Contact.findByIdAndUpdate({ _id: id, owner }, fields);
};

const removeContact = (id, owner) => {
  return Contact.findByIdAndRemove({ _id: id, owner });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
};
