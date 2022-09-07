module.exports = (sequelize, Sequelize) => {
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
        }
    });
    return Membership;
};