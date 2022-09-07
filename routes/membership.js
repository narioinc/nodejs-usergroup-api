var express = require('express');
var router = express.Router();
const memberships = require("../controllers/membership.controller.js");

router.post("/", memberships.create);
// Retrieve all memberships
router.get("/", memberships.findAll);
// Retrieve a single memberships with id
router.get("/:id", memberships.findOne);
// Update a memberships with id
router.put("/:id", memberships.update);
// Delete a memberships with id
router.delete("/:id", memberships.delete);
// Delete all memberships
router.delete("/", memberships.deleteAll);
// Retrieve all memberships for a specific userid
router.get("/", memberships.findAll);

module.exports = router;
