'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'scopes', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: ['user'],
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'scopes');
  }
};

