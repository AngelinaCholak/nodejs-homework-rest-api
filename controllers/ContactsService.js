const ContactsService = require("../models/contacts");
const HttpError = require("../error/error.js");


const { ObjectId } = require("mongoose").Types;

async function getAllContacts(req, res, next) {
  try {
    const ownerId = req.user.id;
    const contacts = await ContactsService.find({
      ownerId: new ObjectId(ownerId),
    });
    res.send(contacts);
  } catch (error) {
    next(error);
  }
}



async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await ContactsService.findById(contactId);

    if (contact === null) {
      throw HttpError(404, `Not found`);
    }

    if (contact.ownerId.toString() !== userId) {
      throw HttpError(404, `Not found`);
    }

    res.send(contact);
  } catch (error) {
    next(error);
  }
}


async function addNewContact(req, res, next) {
  try {
    const result = await ContactsService.create(req.body);
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
}


async function deleteContact(req, res, next) {
  const { contactId } = req.params;
  try {
    const result = await ContactsService.findByIdAndDelete(contactId);

    if (result === null) {
       throw  HttpError(404, `Not found`);
    }

    res.send({ contactId });
  } catch (error) {
    next(error);
  }
}

async function updateContactId(req, res, next) {
  const { contactId } = req.params;

     const contact = {
       name: req.body.name,
       email: req.body.email,
       phone: req.body.phone,
       ownerId: req.user.id,
     };
   try {
     const result = await ContactsService.findByIdAndUpdate(
       contactId,
       contact,
       {
         new: true,
       }
     );

     if (result === null) {
        throw new HttpError(404, `Not found`);
     }

     res.send(result);
   } catch (error) {
     next(error);
   }
}

async function changeContactFavorite(req, res, next) {
  const { contactId } = req.params;

  try {
    const result = await ContactsService.findByIdAndUpdate(
      contactId,
      {
        favorite: req.body.favorite,
      },
      { new: true }
    );

    if (result === null) {
      return res.status(404).send("Contact not found");
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
  
}

module.exports = {
  getAllContacts,
  getContactById,
  addNewContact,
  deleteContact,
  updateContactId,
  changeContactFavorite,

};
