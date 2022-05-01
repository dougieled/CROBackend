const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        timestamp: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
        nativeCurrency: {type: DataTypes.STRING, allowNull: true},
        isDeposit: { type: DataTypes.BOOLEAN, allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false }
    };

    const options = {
        defaultScope: {
        },
        scopes: {
        }
    };

    return sequelize.define('Transaction', attributes, options);
}