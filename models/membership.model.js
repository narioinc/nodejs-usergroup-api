module.exports = (sequelize, Sequelize) => {
    console.log(sequelize.models)
    const Membership = sequelize.define("membership", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: Sequelize.UUID,
            allowNull: false,
        },
        groupId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: sequelize.models.usergroup,
                key: 'id'
              }
        }
    });
    return Membership;
};