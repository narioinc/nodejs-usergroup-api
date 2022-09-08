const db = require("../models");
const UserGroup = db.usergroup;
const { v4: uuidv4 } = require('uuid');
const Op = db.Sequelize.Op;
const kafkaClient = require("../kafka")
const kafkaConfig = require("../kafka/config")

const producer = kafkaClient.producer;
const consumer = kafkaClient.consumer;

consumer.subscribe({ topic: 'userapi', fromBeginning: false })
consumer.run({
  eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      console.log({
          value: message.value.toString(),
          headers: message.headers,
      })
  },
})

// Create and Save a new User group
exports.create = (req, res) => {

    // Validate request
  if (!req.body.groupName) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a User group
  const usergroup = {
    groupName: req.body.groupName,
    groupDescription: req.body.groupDescription,
  };
  // Save User group in the database
  UserGroup.create(usergroup)
    .then(data => {
      kafkaClient.sendActionMessage("USERGROUP_CREATE_SUCCESS", data)
      res.send(data);
    })
    .catch(err => {
      kafkaClient.sendActionMessage("USERGROUP_CREATE_FAIL", req.body)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User group."
      });
    });
  
};
// Retrieve all User groups from the database.
exports.findAll = (req, res) => {
    const groupName = req.query.groupName;
    var condition = groupName ? { groupName: { [Op.like]: `%${groupName}%` } } : null;
    UserGroup.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving User groups."
        });
      });
};

// Find a single User group with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    UserGroup.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find User group with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User group with id=" + id
        });
      });
};
// Update a User group by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    UserGroup.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          kafkaClient.sendActionMessage("USERGROUP_UPDATE_SUCCESS", req.params)
          res.send({
            message: "User Group was updated successfully."
          });
        } else {
          kafkaClient.sendActionMessage("USERGROUP_UPDATE_FAIL", req.params)
          res.send({
            message: `Cannot update User group with id=${id}. Maybe User group was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        kafkaClient.sendActionMessage("USERGROUP_UPDATE_FAIL", req.params)
        res.status(500).send({
          message: "Error updating User group with id=" + id
        });
      });
};

// Delete a User group with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    UserGroup.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          kafkaClient.sendActionMessage("USERGROUP_DELETE_SUCCESS", req.params)
          res.send({
            message: "User Group was deleted successfully!"
          });
        } else {
          kafkaClient.sendActionMessage("USERGROUP_DELETE_FAIL", req.params)
          res.send({
            message: `Cannot delete User group with id=${id}. Maybe User group was not found!`
          });
        }
      })
      .catch(err => {
        kafkaClient.sendActionMessage("USERGROUP_DELETE_FAIL", req.params)
        res.status(500).send({
          message: "Could not delete User group with id=" + id
        });
      });
};

// Delete all User group from the database.
exports.deleteAll = (req, res) => {
  UserGroup.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          kafkaClient.sendActionMessage("USERGROUP_FLUSH_SUCCESS", {})
          res.send({ message: `${nums} User groups were deleted successfully!` });
        })
        .catch(err => {
          kafkaClient.sendActionMessage("USERGROUP_FLUSH_FAIL", {})
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all User groups."
          });
        });
};
