const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const readContacts = async () => {
  return await fs
    .readFile(contactsPath, "utf-8")
    .then((data) => JSON.parse(data));
};

const listContacts = async () => {
  return await readContacts();
};

const getContactById = async (contactId) => {
  const contacts = await readContacts();
  return contacts.find((el) => el.id === contactId);
};

const removeContact = async (contactId) => {
  const contacts = await readContacts();
  const newContacts = contacts.filter((contact) => contact.id !== contactId);

  if (contacts.length > newContacts.length) {
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return true;
  }
  return false;
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  const newContact = { id: nanoid(), name, email, phone };
  const contacts = await readContacts();
  await fs.writeFile(contactsPath, JSON.stringify([...contacts, newContact]));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await readContacts();
  const indexToUpdate = contacts.findIndex(
    (contact) => contact.id === contactId
  );
  if (indexToUpdate >= 0) {
    contacts[indexToUpdate] = { ...contacts[indexToUpdate], ...body };
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return contacts[indexToUpdate];
  }
  return false;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
