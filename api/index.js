const express = require("express");
const router = express.Router();
const ctrlContact = require("../controller/contacts");
const ctrlUsers = require("../controller/users");
const passport = require("passport");

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized",
        data: "Unauthorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

router.get("/contacts", auth, ctrlContact.get);

router.get("/contacts/:contactId", auth, ctrlContact.getById);

router.post("/contacts", auth, ctrlContact.create);

router.put("/contacts/:contactId", auth, ctrlContact.update);

router.patch("/contacts/:contactId/favorite", auth, ctrlContact.updateStatus);

router.delete("/contacts/:contactId", auth, ctrlContact.remove);

router.post("/users/signup", ctrlUsers.signup);

router.post("/users/login", ctrlUsers.login);

router.post("/users/logout", auth, ctrlUsers.logout);

router.get("/users/current", auth, ctrlUsers.list);

module.exports = router;
