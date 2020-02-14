"use strict";

const Contact = require("../models/contact");
const express = require("express");
const nanoid  = require("nanoid");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const nodeMailerHandler = require("../controllers/nodeMailerHandler.js");

let savedContacts = [];
let err = new Error();

//sending the message to the DB

router.post(
  "/contact",
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("I didn't catch your name")
      .isLength({ max: 30 })
      .withMessage("Try something shorter"),
    check("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Something's not right"),
    check("message")
      .not()
      .isEmpty()
      .isLength({ min: 10 })
      .withMessage("What about that message")
      .isLength({ max: 350 })
      .withMessage("Character limit exceded")
  ],
  (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      err.status = 422;
      res.json({ errors: errors.array() });
    } else {
      Contact.find({ name: name }, "-__v", (err, result) => {
        if (err) {
          return next(err);
        } else {
          if (result[0] !== undefined) {
            //a document matching the name property has been found
            Contact.findOneAndUpdate(
              { name: name },
              {
                $push: {
                  messages: [
                    {
                      _id: nanoid(),
                      message: message,
                      date: new Date()
                    }
                  ]
                }
              },
              (err, doc) => {
                if (err) {
                  return next(err);
                } else {
                  if (doc) {
                    //contact is found by name
                    //proceeding to get the updated messages entry from the contact's document
                    Contact.find(
                      { name: doc.name },
                      "-__v",
                      (err, updatedDoc) => {
                        let last = updatedDoc[0].messages.length - 1; //index of the last entry
                        if (err) {
                          return next(err);
                        } else {
                          console.log(updatedDoc[0]);
                          //view the last entry
                          res.json({
                            _id: updatedDoc[0]._id,
                            name: updatedDoc[0].name,
                            message: updatedDoc[0].messages[last].message,
                            date: updatedDoc[0].messages[last].date
                          });
                          //calling the nodeMailerHandler
                          nodeMailerHandler(name, email, message); //sending a new email
                        }
                      }
                    );
                  } else {
                    //contact's name not found
                    err = new Error("Name: " + name + " - Not Found");
                    err.status = 404;
                    return next(err);
                  }
                }
              }
            );
          } else {
            //no match so proceed to add new contact
            savedContacts.push({
              _id: nanoid(),
              name: name,
              email: email,
              messages: [
                {
                  _id: nanoid(),
                  message: message,
                  date: new Date()
                }
              ]
            }); //populating the savedContacts array with the newly added contact's document
            res.json({
              _id: savedContacts[0]._id,
              name: savedContacts[0].name,
              email: savedContacts[0].email,
              messages: [savedContacts[0].messages[0].message]
            });
            //saving the contact's object from the savedContacts array as a contact's document in the DB
            Contact.create(savedContacts, (err, doc) => {
              err ? next(err) : console.log(doc);
              savedContacts = [];
            });
            //console.log(savedContacts);
            //calling the nodeMailerHandler
            nodeMailerHandler(name, email, message); //sending a new email
          }
        }
      });
    }
    console.log(name);
  }
);

/*router.get("/contacts", (req, res, next) => {
  //get an array with all the contacats in the DB"
  Contact.find({})
    //.select('-exercise -__v')
    .exec((err, doc) => {
      err ? next(err) : res.json(doc);
      console.log(doc);
    });
});*/

module.exports = router;
