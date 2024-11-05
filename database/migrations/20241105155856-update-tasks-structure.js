"use strict";

const Sequelize = require("sequelize");

/** @type {import("sequelize-cli").Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.removeColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "assigned_user_id");
		await queryInterface.removeColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "created_by_user_id");

		await queryInterface.removeColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "assigned_account_id");
		await queryInterface.addColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "assigned_account_id", {
			type: Sequelize.ARRAY(Sequelize.INTEGER),
		});

		await queryInterface.removeColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "assigned_group_id");
		await queryInterface.addColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "assigned_group_id", {
			type: Sequelize.ARRAY(Sequelize.INTEGER),
		});

		await queryInterface.addColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "metadata", {
			type: Sequelize.JSONB,
		});
	},

	async down(queryInterface) {
		await queryInterface.addColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "assigned_user_id", {
			type: Sequelize.INTEGER,
		});
		await queryInterface.addColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "created_by_user_id", {
			type: Sequelize.INTEGER,
			allowNull: false,
		});

		await queryInterface.removeColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "assigned_account_id");
		await queryInterface.addColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "assigned_account_id", {
			type: Sequelize.INTEGER,
		});

		await queryInterface.removeColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "assigned_group_id");
		await queryInterface.addColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "assigned_group_id", {
			type: Sequelize.INTEGER,
		});

		await queryInterface.removeColumn({ schema: process.env.DB_SCHEMA, tableName: "tasks" }, "metadata");
	},
};
