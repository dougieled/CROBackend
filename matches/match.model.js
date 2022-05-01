const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        competition: { type: DataTypes.STRING, allowNull: false },
        teamAName: { type: DataTypes.STRING, allowNull: false },
        teamAGoals: { type: DataTypes.INTEGER, allowNull: false },
        teamAPoints: { type: DataTypes.INTEGER, allowNull: false },
        teamBName: { type: DataTypes.STRING, allowNull: false },
        teamBGoals: { type: DataTypes.INTEGER, allowNull: false },
        teamBPoints: { type: DataTypes.INTEGER, allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false },
    };

    const options = {
        defaultScope: {
        },
        scopes: {
        }
    };

    return sequelize.define('Match', attributes, options);
}