"use strict";

const Sequelize = require("sequelize");

/** @type {import("sequelize-cli").Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.changeColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "created_by_account_id", {
			type: Sequelize.INTEGER,
			allowNull: true,
		});
	},

	async down(queryInterface) {
		await queryInterface.changeColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "created_by_account_id", {
			type: Sequelize.INTEGER,
			allowNull: false,
		});
	},
};
