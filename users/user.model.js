const {DataTypes} = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: { type: DataTypes.STRING, allowNull: false},
        passwordHash: { type: DataTypes.STRING, allowNull: false},
        title: { type: DataTypes.STRING, allowNull: false},
        firstName: { type: DataTypes.STRING, allowNull: false},
        lastName: { type: DataTypes.STRING, allowNull: false},
        role: { type: DataTypes.STRING, allowNull: false},
    };

    const options = {
        defaultScope: {
            attributes: { exclude: ['passwordHash']}
        },
        scopes: {
            withHash: { attributes: {}}
        }
    };

    return sequelize.define('User', attributes, options);
}