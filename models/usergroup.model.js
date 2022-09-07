module.exports = (sequelize, Sequelize) => {
    const UserGroup = sequelize.define("usergroup", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        groupName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        groupDescription: {
            type: Sequelize.STRING
        }
    });
    return UserGroup;
};