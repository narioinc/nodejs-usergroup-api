const db = require("../models");
const Membership = db.membership;
const { v4: uuidv4 } = require('uuid');
const Op = db.Sequelize.Op;
const kafkaConfig = require("../kafka/config")
const kafkaClient = require("../kafka")

const producer = kafkaClient.producer;

// Create and Save a new Membership
exports.create = (req, res) => {

  // Validate request
  if (!req.body.userId || !req.body.groupId) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a Membership
  const user = {
    userId: req.body.userId,
    groupId: req.body.groupId
  };
  // Save Membership in the database
  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User group."
      });
    });

};
// Retrieve all Membership from the database.
exports.findAll = (req, res) => {
  const userId = req.query.userId;
  var condition = userId ? { userId: { [Op.like]: `%${userId}%` } } : null;
  User.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Membership."
      });
    });
};

// Find a single Membership with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  User.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Membership with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Membership with id=" + id
      });
    });
};
// Update a Membership by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Membership was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Membership with id=${id}. Maybe Membership was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Membership with id=" + id
      });
    });
};

// Delete a Membership with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Membership was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Membership with id=${id}. Maybe Membership was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Membership with id=" + id
      });
    });
};

// Delete all Membership from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Membership were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Memberships."
      });
    });
};

function sendActionMessage(action, payload, traceId = uuidv4()) {
  console.log("Sending message to topic :: " + kafkaConfig.KAFKA_TOPIC)
  message = { "traceId": traceId, "action": action, "payload": payload }
  if(action){
    producer.send({
      topic: kafkaConfig.KAFKA_TOPIC,
      messages: [
        {
          key: null, value: JSON.stringify(message)
        }
      ],
    }).then(()=>{
      console.log("action message sent successfully")
    })
    .catch((err)=>{
      console.log(err)
    })
  }else{
    console.log("Action not specified")
  }
}