var express = require('express');
var router = express.Router();
const usergroups = require("../controllers/usergroup.controller.js");

router.post("/", usergroups.create);
// Retrieve all UserGroup
router.get("/", usergroups.findAll);
// Retrieve a single UserGroup with id
router.get("/:id", usergroups.findOne);
// Update a UserGroup with id
router.put("/:id", usergroups.update);
// Delete a UserGroup with id
router.delete("/:id", usergroups.delete);
// Delete all UserGroup
router.delete("/", usergroups.deleteAll);

module.exports = router;
